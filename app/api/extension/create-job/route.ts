import { NextResponse } from "next/server";
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
  const { company, position, location, url, description } = body;

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

  const appliedColumn = await db.query.columns.findFirst({
    where: and(eq(columns.boardId, board.id), eq(columns.name, "Applied")),
  });

  if (!appliedColumn) {
    return NextResponse.json(
      { error: "Applied column not found" },
      { status: 404 },
    );
  }

  const [minOrderResult] = await db
    .select({ minOrder: min(jobs.order) })
    .from(jobs)
    .where(eq(jobs.columnId, appliedColumn.id));

  const nextOrder = (minOrderResult?.minOrder ?? 0) - 1;

  await db.insert(jobs).values({
    company,
    position,
    location,
    url,
    description,
    boardId: board.id,
    columnId: appliedColumn.id,
    userId: session.user.id,
    order: nextOrder,
    appliedDate: new Date(),
  });

  return NextResponse.json({ success: true });
}
