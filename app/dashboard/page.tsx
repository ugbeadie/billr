import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    console.log("No user session");
    return <Navbar />;
  }

  const userBoards = await db.query.boards.findMany({
    where: eq(boards.userId, session.user.id),
    with: {
      columns: true,
    },
  });

  // ✅ This logs directly from Neon
  console.log("✅ Boards for current user:", userBoards);

  return <Navbar />;
}
