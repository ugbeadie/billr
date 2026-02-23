import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import KanbanBoard from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import DashboardAddJobButton from "@/components/DashboardAddJobButton";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    console.log("No user session");
    return <Navbar />;
  }

  const board = await db.query.boards.findFirst({
    where: eq(boards.userId, session.user.id),
    with: {
      columns: true,
    },
  });

  console.log("Boards for current user:", board);

  return (
    <div>
      <Navbar />
      {board ? (
        <>
          <DashboardAddJobButton
            boardId={board.id}
            columnId={board.columns[0]?.id || ""}
          />

          <KanbanBoard board={board} userId={session.user.id} />
        </>
      ) : (
        <p>No board found</p>
      )}
    </div>
  );
}
