import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import JobStatsCards from "@/components/JobStatsCards";
import Analytics from "@/components/Analytics";
import { getJobStats } from "@/server/jobstats";
import { getAnalytics } from "@/server/analyticsstats";

export default async function StatsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <Navbar />;
  }

  const stats = await getJobStats();
  const analytics = await getAnalytics();

  return (
    <div>
      <Navbar />

      <main className="mt-6 space-y-8">
        <JobStatsCards stats={stats} />
        <Analytics stats={analytics} />
      </main>
    </div>
  );
}
