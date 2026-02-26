"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { initializeUserBoard } from "@/lib/board";
import { db } from "@/db/drizzle";
import { boards, columns, jobs, user as userTable } from "@/db/schema";
import { eq, and, min } from "drizzle-orm";
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
  } catch (err) {
    const e = err as Error;
    return {
      errors: { email: [e.message || "Unable to create account"] },
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
  } catch (err) {
    const e = err as Error;
    return {
      errors: { email: [e.message || "Unable to sign in"] },
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

  // Verify board ownership
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, session.user.id)),
  });
  if (!board) throw new Error("Unauthorized board access");

  // Verify column belongs to board and get column name for status
  const column = await db.query.columns.findFirst({
    where: and(eq(columns.id, columnId), eq(columns.boardId, boardId)),
  });
  if (!column) throw new Error("Invalid column");

  // Derive status from column name
  const status = column.name.toLowerCase();

  // Get max order in this column
  const [minOrderResult] = await db
    .select({ minOrder: min(jobs.order) })
    .from(jobs)
    .where(eq(jobs.columnId, columnId));

  const nextOrder = (minOrderResult?.minOrder ?? 0) - 1;

  // Insert new job
  const [newJob] = await db
    .insert(jobs)
    .values({
      company,
      position,
      status,
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
    })
    .returning();

  revalidatePath("/dashboard");

  return;
}
