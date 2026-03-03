"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { initializeUserBoard } from "@/lib/board";
import { db } from "@/db/drizzle";
import { boards, columns, jobs, user as userTable } from "@/db/schema";
import { eq, and, min, asc, ne, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const signUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type ActionState = {
  errors?: Record<string, string[]>;
  values?: { name?: string; email?: string };
};

interface CreateJobData {
  company: string;
  position: string;
  salary?: string;
  location?: string;
  jobType?: string;
  url?: string;
  jobMode?: string;
  description?: string;
  boardId: string;
  columnId: string;
  appliedDate?: Date;
}

export async function signUp(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const result = signUpSchema.safeParse(rawData);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: { name: rawData.name, email: rawData.email },
    };
  }

  try {
    await auth.api.signUpEmail({ body: result.data });

    const [createdUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, result.data.email))
      .limit(1);

    if (!createdUser?.id) throw new Error("User not found after signup");

    await initializeUserBoard(createdUser.id);
  } catch (err: any) {
    const message =
      err?.body?.message ||
      err?.response?.body?.message ||
      err?.message ||
      "Unable to create account";

    return {
      errors: { email: [message] },
      values: { name: rawData.name, email: rawData.email },
    };
  }

  redirect("/dashboard");
}

export async function signIn(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };
  const result = signInSchema.safeParse(rawData);

  if (!result.success)
    return {
      errors: result.error.flatten().fieldErrors,
      values: { email: rawData.email },
    };

  try {
    await auth.api.signInEmail({ body: result.data });
  } catch (err: any) {
    console.log("Better Auth error:", err);

    const message =
      err?.body?.message ||
      err?.response?.body?.message ||
      err?.message ||
      "Unable to sign in";

    return {
      errors: { email: [message] },
      values: { email: rawData.email },
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

export async function createJob(data: CreateJobData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const {
    company,
    position,
    salary,
    location,
    jobType,
    url,
    jobMode,
    description,
    boardId,
    columnId,
    appliedDate,
  } = data;

  if (!company || !position || !boardId || !columnId)
    throw new Error("Missing required fields");

  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, session.user.id)),
  });

  if (!board) throw new Error("Unauthorized board access");

  const column = await db.query.columns.findFirst({
    where: and(eq(columns.id, columnId), eq(columns.boardId, boardId)),
  });

  if (!column) throw new Error("Invalid column");

  const [minOrderResult] = await db
    .select({ minOrder: min(jobs.order) })
    .from(jobs)
    .where(eq(jobs.columnId, columnId));

  const nextOrder = (minOrderResult?.minOrder ?? 0) - 1;

  await db.insert(jobs).values({
    company,
    position,

    ...(salary && { salary }),
    ...(location && { location }),
    ...(jobType && { jobType }),
    ...(url && { url }),
    ...(jobMode && { jobMode }),
    ...(description && { description }),

    boardId,
    columnId,
    userId: session.user.id,
    order: nextOrder,
    appliedDate: appliedDate ?? new Date(),
  });

  revalidatePath("/dashboard");
}

interface UpdateJobProps {
  company?: string;
  position?: string;
  salary?: string | null;
  location?: string | null;
  jobType?: string | null;
  url?: string | null;
  jobMode?: string | null;
  description?: string | null;
  appliedDate?: Date | string | null;

  columnId?: string;
  order?: number;
}

export async function updateJob(id: string, input: UpdateJobProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Load job and verify ownership
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.userId, session.user.id)))
    .limit(1);

  if (!job) {
    return { error: "Job not found" };
  }

  const targetColumnId = input.columnId ?? job.columnId;
  const targetIndex = typeof input.order === "number" ? input.order : undefined;

  const isMovingColumn = targetColumnId !== job.columnId;

  const baseUpdate = {
    company: input.company,
    position: input.position,
    salary: input.salary ?? undefined,
    location: input.location ?? undefined,
    jobType: input.jobType ?? undefined,
    url: input.url ?? undefined,
    jobMode: input.jobMode ?? undefined,
    description: input.description ?? undefined,
    appliedDate: input.appliedDate ? new Date(input.appliedDate) : undefined,
  };

  // Load siblings in target column (excluding this job)
  const targetSiblings = await db
    .select({
      id: jobs.id,
      order: jobs.order,
    })
    .from(jobs)
    .where(and(eq(jobs.columnId, targetColumnId), ne(jobs.id, job.id)))
    .orderBy(asc(jobs.order));

  let newOrder = job.order;

  // Insert at specific index
  if (targetIndex !== undefined) {
    const insertAt = Math.max(0, Math.min(targetIndex, targetSiblings.length));

    for (let i = insertAt; i < targetSiblings.length; i++) {
      await db
        .update(jobs)
        .set({ order: targetSiblings[i].order + 1 })
        .where(eq(jobs.id, targetSiblings[i].id));
    }

    newOrder = insertAt === 0 ? 0 : targetSiblings[insertAt - 1].order + 1;
  }

  // Move to another column (append to end)
  if (isMovingColumn && targetIndex === undefined) {
    const last = targetSiblings.at(-1);
    newOrder = last ? last.order + 1 : 0;
  }

  // Close gap in old column
  if (isMovingColumn) {
    const oldColumnJobs = await db
      .select({
        id: jobs.id,
        order: jobs.order,
      })
      .from(jobs)
      .where(
        and(
          eq(jobs.columnId, job.columnId),
          gte(jobs.order, job.order),
          ne(jobs.id, job.id),
        ),
      );

    for (const j of oldColumnJobs) {
      await db
        .update(jobs)
        .set({ order: j.order - 1 })
        .where(eq(jobs.id, j.id));
    }
  }

  // Update the job
  await db
    .update(jobs)
    .set({
      ...baseUpdate,
      columnId: targetColumnId,
      order: newOrder,
    })
    .where(eq(jobs.id, job.id));

  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteJob(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const [job] = await db
    .select({
      id: jobs.id,
      columnId: jobs.columnId,
      order: jobs.order,
    })
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.userId, session.user.id)))
    .limit(1);

  if (!job) {
    return { error: "Job not found" };
  }

  // Delete the job
  await db.delete(jobs).where(eq(jobs.id, id));

  // Close gap in column ordering
  const remaining = await db
    .select({
      id: jobs.id,
      order: jobs.order,
    })
    .from(jobs)
    .where(and(eq(jobs.columnId, job.columnId), gte(jobs.order, job.order)));

  for (const j of remaining) {
    await db
      .update(jobs)
      .set({ order: j.order - 1 })
      .where(eq(jobs.id, j.id));
  }

  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteMultipleJobs(ids: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  for (const id of ids) {
    await deleteJob(id);
  }

  revalidatePath("/dashboard");

  return { success: true };
}
