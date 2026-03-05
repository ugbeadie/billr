import { db } from "@/db/drizzle";
import { jobs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";

export type JobActivityDay = {
  day: string; // YYYY-MM-DD
  count: number;
};

export async function getJobActivity(): Promise<JobActivityDay[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return [];

  const userId = session.user.id;

  const result = await db.execute<{
    day: string;
    count: number;
  }>(sql`
    select
      date(j.created_at) as day,
      count(*)::int as count
    from jobs j
    where j.user_id = ${userId}
    group by day
    order by day asc
  `);

  return result.rows;
}
