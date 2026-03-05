"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { jobs } from "@/db/schema";
import { eq, gte, lt, and, sql } from "drizzle-orm";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek() {
  const d = startOfToday();
  const day = d.getDay(); // 0 = sunday
  d.setDate(d.getDate() - day);
  return d;
}

function startOfMonth() {
  const d = startOfToday();
  d.setDate(1);
  return d;
}

export async function getJobStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const today = startOfToday();
  const week = startOfWeek();
  const month = startOfMonth();

  const effectiveDate = sql<Date>`coalesce(${jobs.appliedDate}, ${jobs.createdAt})`;

  const [result] = await db
    .select({
      total: sql<number>`count(*)`,
      today: sql<number>`
      count(*) filter (where ${effectiveDate} >= ${today})
    `,
      week: sql<number>`
      count(*) filter (where ${effectiveDate} >= ${week})
    `,
      month: sql<number>`
      count(*) filter (where ${effectiveDate} >= ${month})
    `,
    })
    .from(jobs)
    .where(eq(jobs.userId, userId));

  return {
    total: Number(result.total),
    today: Number(result.today),
    week: Number(result.week),
    month: Number(result.month),
  };
}
