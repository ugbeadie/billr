import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { boards, columns, jobs } from "@/db/schema";
import { and, eq, min } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    company,
    position,
    location,
    url,
    description,
    salary,
    jobType,
    jobMode,
  } = body;

  if (!company || !position) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Get user board
  const board = await db.query.boards.findFirst({
    where: eq(boards.userId, session.user.id),
  });

  if (!board) {
    return NextResponse.json({ error: "No board found" }, { status: 404 });
  }

  // Honour the column the user picked in the extension, but only after
  // confirming it belongs to their own board.
  let targetColumn = body.columnId
    ? await db.query.columns.findFirst({
        where: and(
          eq(columns.id, body.columnId),
          eq(columns.boardId, board.id),
        ),
      })
    : undefined;

  // Quick-save sends no column. Fall back to "Applied" if the user still has
  // one, otherwise the first column on the board — never 404 over a rename.
  if (!targetColumn) {
    targetColumn =
      (await db.query.columns.findFirst({
        where: and(eq(columns.boardId, board.id), eq(columns.name, "Applied")),
      })) ??
      (await db.query.columns.findFirst({
        where: eq(columns.boardId, board.id),
        orderBy: (cols, { asc: ascending }) => [ascending(cols.order)],
      }));
  }

  if (!targetColumn) {
    return NextResponse.json(
      { error: "This board has no columns" },
      { status: 404 },
    );
  }

  const [minOrderResult] = await db
    .select({ minOrder: min(jobs.order) })
    .from(jobs)
    .where(eq(jobs.columnId, targetColumn.id));

  const nextOrder = (minOrderResult?.minOrder ?? 0) - 1;

  await db.insert(jobs).values({
    company,
    position,
    location,
    url,
    description,
    salary,
    jobType,
    jobMode,
    boardId: board.id,
    columnId: targetColumn.id,
    userId: session.user.id,
    order: nextOrder,
    appliedDate: new Date(),
  });

  // Every server action does this too; without it the board can serve a cached
  // payload that predates this job.
  revalidatePath("/dashboard");
  revalidatePath("/stats");

  // Return where it landed, so the popup reports the truth.
  return NextResponse.json({
    success: true,
    columnId: targetColumn.id,
    columnName: targetColumn.name,
  });
}
