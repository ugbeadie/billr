import { TrendingUp, Users, Crown, Target } from "lucide-react";

type Stats = {
  total: number;
  today: number;
  week: number;
  month: number;
};

export default function JobStatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4">
      <StatCard
        title="Total Applications"
        value={stats.total}
        icon={TrendingUp}
        gradient="from-violet-600 to-fuchsia-600"
      />

      <StatCard
        title="Applications Today"
        value={stats.today}
        icon={Users}
        gradient="from-blue-600 to-sky-500"
      />

      <StatCard
        title="Applications This Week"
        value={stats.week}
        icon={Crown}
        gradient="from-orange-500 to-red-500"
      />

      <StatCard
        title="Applications This Month"
        value={stats.month}
        icon={Target}
        gradient="from-green-600 to-emerald-500"
      />
    </div>
  );
}

type CardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
};

function StatCard({ title, value, icon: Icon, gradient }: CardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 text-white
        bg-gradient-to-r ${gradient}
        shadow-sm
      `}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium opacity-90">{title}</p>

        <Icon className="h-6 w-6 opacity-90" />
      </div>

      <div className="mt-3 text-3xl font-bold leading-none">{value}</div>
    </div>
  );
}
