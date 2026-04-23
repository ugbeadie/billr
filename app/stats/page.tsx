import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import JobStatsCards from "@/components/JobStatsCards";
import Analytics from "@/components/Analytics";
import { getJobStats } from "@/server/jobstats";
import { getAnalytics } from "@/server/analyticsstats";
import { getJobActivity } from "@/server/jobactivity";
import JobActivityHeatmap from "@/components/JobActivityHeatmap";

export default async function StatsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <Navbar />;
  }

  const stats = await getJobStats();
  const analytics = await getAnalytics();
  const activity = await getJobActivity();

  return (
    <div>
      <Navbar user={session.user} />

      <main className="mt-6 space-y-8">
        <JobStatsCards stats={stats} />
        <Analytics stats={analytics} />
        <JobActivityHeatmap data={activity} stats={stats} />
      </main>
    </div>
  );
}
