"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { jobs, columns } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getAnalytics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const breakdownResult = await db
    .select({
      name: columns.name,
      count: sql<number>`count(${jobs.id})`,
    })
    .from(jobs)
    .leftJoin(columns, eq(jobs.columnId, columns.id))
    .where(eq(jobs.userId, userId))
    .groupBy(columns.name);

  const statusBreakdown = breakdownResult.map((row) => ({
    name: row.name ?? "Unknown",
    value: Number(row.count),
  }));

  const getValue = (name: string) =>
    statusBreakdown.find((s) => s.name.toLowerCase() === name.toLowerCase())
      ?.value ?? 0;

  const applied = getValue("applied");
  const interviewing = getValue("interviewing");
  const offer = getValue("offer");
  const rejected = getValue("rejected");
  const ghosted = getValue("ghosted");

  const totalApplications = applied + interviewing + offer + rejected + ghosted;

  const responses = interviewing + offer + rejected;

  const responseRate =
    totalApplications > 0
      ? Math.round((responses / totalApplications) * 100)
      : 0;

  const totalInterviews = interviewing + offer + rejected;

  const offerRate =
    totalInterviews > 0 ? Math.round((offer / totalInterviews) * 100) : 0;

  const rejectRate =
    totalInterviews > 0 ? Math.round((rejected / totalInterviews) * 100) : 0;

  return {
    totalInterviews,
    responseRate,
    offerRate,
    rejectRate,
    statusBreakdown,
  };
}
