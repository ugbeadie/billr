import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { boards, columns } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const board = await db.query.boards.findFirst({
    where: eq(boards.userId, session.user.id),
  });

  if (!board) {
    return NextResponse.json({ authenticated: true, columns: [] });
  }

  // Ordered so the popup's dropdown matches the board left-to-right.
  const userColumns = await db.query.columns.findMany({
    where: eq(columns.boardId, board.id),
    orderBy: (cols, { asc }) => [asc(cols.order)],
  });

  return NextResponse.json({
    authenticated: true,
    boardId: board.id,
    columns: userColumns,
  });
}
