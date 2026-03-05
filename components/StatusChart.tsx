"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

function getStatusColor(name: string) {
  const map: Record<string, string> = {
    wishlist: "#3B82F6",
    applied: "#EAB308",
    interviewing: "#8B5CF6",
    offer: "#22C55E",
    rejected: "#EF4444",
    ghosted: "#6B7280",
  };

  return map[name.toLowerCase()] || "#9CA3AF";
}

export default function StatusChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">
        Status breakdown
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1 space-y-3">
          {data.map((entry) => {
            const percentage =
              total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";

            const color = getStatusColor(entry.name);

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />

                  <span className="font-medium text-gray-700">
                    {entry.name}
                  </span>
                </div>

                <span className="text-gray-600 font-medium">
                  {entry.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* chart */}
        <div className="w-56 h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-gray-400">APPLICATIONS</span>
            <span className="text-2xl font-bold text-purple-600">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
