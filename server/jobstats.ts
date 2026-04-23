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

function daysBetween(previous: string, current: string) {
  const prev = new Date(previous);
  const curr = new Date(current);
  return Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
}

function computeStreaks(days: string[]) {
  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDays = [...new Set(days)].sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let streak = 0;
  let previousDay: string | null = null;

  for (const day of sortedDays) {
    if (previousDay && daysBetween(previousDay, day) === 1) {
      streak += 1;
    } else {
      streak = 1;
    }

    longestStreak = Math.max(longestStreak, streak);
    previousDay = day;
  }

  const today = startOfToday();
  let consecutive = 0;
  for (let i = 0; ; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const isoDay = checkDate.toISOString().slice(0, 10);
    if (days.includes(isoDay)) {
      consecutive += 1;
    } else {
      break;
    }
  }

  currentStreak = consecutive;
  return { currentStreak, longestStreak };
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

  const dayRows = await db.execute<{ day: string | Date }>(sql`
    select distinct date(${jobs.createdAt}) as day
    from jobs
    where ${jobs.userId} = ${userId}
    order by day asc
  `);

  const days = dayRows.rows.map((row) =>
    typeof row.day === "string" ? row.day : row.day.toISOString().slice(0, 10),
  );
  const { currentStreak, longestStreak } = computeStreaks(days);

  return {
    total: Number(result.total),
    today: Number(result.today),
    week: Number(result.week),
    month: Number(result.month),
    currentStreak,
    longestStreak,
  };
}
