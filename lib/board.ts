import { db } from "@/db/drizzle";
import { boards, columns } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const DEFAULT_COLUMNS = [
  { name: "WishList", order: 0 },
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
  { name: "Ghosted", order: 5 },
];
export async function initializeUserBoard(userId: string) {
  const existingBoard = await db
    .select()
    .from(boards)
    .where(and(eq(boards.userId, userId), eq(boards.name, "Your Jobs")))
    .limit(1);

  if (existingBoard.length > 0) {
    return existingBoard[0];
  }

  const [board] = await db
    .insert(boards)
    .values({
      name: "Your Jobs",
      userId,
    })
    .returning();

  const columnRows = DEFAULT_COLUMNS.map((col) => ({
    name: col.name,
    order: col.order,
    boardId: board.id,
    job: [],
  }));

  await db.insert(columns).values(columnRows);

  return board;
}
