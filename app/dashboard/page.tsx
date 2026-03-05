import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardClient from "./DasboardClientWrapper";
import { getJobStats } from "@/server/jobstats";
import { getAnalytics } from "@/server/analyticsstats";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <Navbar />;
  }
  const stats = await getJobStats();
  const analytics = await getAnalytics();

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
      <Navbar />

      {board ? (
        <DashboardClient
          board={board}
          userId={session.user.id}
          stats={stats}
          analytics={analytics}
        />
      ) : (
        <p>No board found</p>
      )}
    </div>
  );
}
