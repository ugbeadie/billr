"use client";

import { Info } from "lucide-react";

interface Props {
  stats: {
    totalInterviews: number;
    responseRate: number;
    offerRate: number;
    rejectRate: number;
    statusBreakdown: {
      name: string;
      value: number;
    }[];
  };
}
import StatusChart from "./StatusChart";

export default function Analytics({ stats }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 mt-6 mb-10">
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Conversion Analysis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            value={stats.totalInterviews}
            label="Total Interviews"
            bgColor="bg-blue-50"
            textColor="text-blue-600"
            tooltip="Count of jobs that reached the interview stage."
          />

          <StatCard
            value={`${stats.responseRate}%`}
            label="Response Rate"
            bgColor="bg-green-50"
            textColor="text-green-600"
            tooltip="Applications that got any response (excluding ghosted/no response)."
          />

          <StatCard
            value={`${stats.offerRate}%`}
            label="Interview → Offer"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
            tooltip="Percentage of interviews that resulted in a job offer."
          />

          <StatCard
            value={`${stats.rejectRate}%`}
            label="Interview → Rejected"
            bgColor="bg-red-50"
            textColor="text-red-600"
            tooltip="Percentage of interviews that ended in rejection."
          />
        </div>
      </div>

      <StatusChart data={stats.statusBreakdown} />
    </div>
  );
}

function StatCard({
  value,
  label,
  bgColor,
  textColor,
  tooltip,
}: {
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
  tooltip: string;
}) {
  return (
    <div
      className={`relative rounded-xl p-5 flex flex-col items-center justify-center text-center ${bgColor}`}
    >
      <div
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-help"
        title={tooltip}
      >
        <Info className="h-4 w-4" />
      </div>

      <div className={`text-3xl font-bold mb-1 ${textColor}`}>{value}</div>
      <div className={`text-sm font-medium ${textColor}`}>{label}</div>
    </div>
  );
}
