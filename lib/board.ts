import { db } from "@/db/drizzle";
import { boards, columns } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const DEFAULT_COLUMNS = [
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
  { name: "Ghosted", order: 5 },
];

export async function initializeUserBoard(userId: string) {
  // 1. check if board exists
  const existing = await db
    .select()
    .from(boards)
    .where(and(eq(boards.userId, userId), eq(boards.name, "Job Hunt")))
    .limit(1);

  if (existing.length) {
    const board = existing[0];

    const boardColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.boardId, board.id));

    return { board, columns: boardColumns };
  }

  // 2. create board (YOU MUST PROVIDE id)
  const boardId = randomUUID();

  const [board] = await db
    .insert(boards)
    .values({
      id: boardId,
      name: "Job Hunt",
      userId,
    })
    .returning();

  // 3. create default columns (YOU MUST PROVIDE id)
  const columnRows = DEFAULT_COLUMNS.map((c) => ({
    id: randomUUID(),
    name: c.name,
    order: c.order,
    boardId: boardId,
  }));

  await db.insert(columns).values(columnRows);

  const createdColumns = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId));

  return { board, columns: createdColumns };
}
