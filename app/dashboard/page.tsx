import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardClient from "./DashboardClientWrapper";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <Navbar />;
  }

  const board = await db.query.boards.findFirst({
    where: eq(boards.userId, session.user.id),
    with: {
      columns: {
        with: {
          jobs: true,
        },
      },
    },
  });

  return (
    <div>
      <Navbar user={session?.user} />

      {board ? (
        <DashboardClient board={board} userId={session.user.id} />
      ) : (
        <p>No board found</p>
      )}
    </div>
  );
}
