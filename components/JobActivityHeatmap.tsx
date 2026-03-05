"use client";

import { useMemo, useState } from "react";

type ActivityDay = {
  day: string;
  count: number;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getColor(count: number) {
  if (count === 0) return "bg-[#ebedf0]";
  if (count < 2) return "bg-blue-200";
  if (count < 4) return "bg-blue-300";
  if (count < 6) return "bg-blue-400";
  return "bg-blue-600";
}

export default function JobActivityHeatmap({ data }: { data: ActivityDay[] }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const availableYears = useMemo(() => {
    const years = new Set(data.map((d) => parseInt(d.day.split("-")[0])));
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [data, currentYear]);

  const applicationsThisYear = useMemo(() => {
    return data
      .filter((d) => new Date(d.day).getFullYear() === selectedYear)
      .reduce((sum, d) => sum + d.count, 0);
  }, [data, selectedYear]);

  const { weeks, monthLabels } = useMemo(() => {
    const map = new Map(data.map((d) => [d.day, d.count]));

    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const startDayOfWeek = startDate.getDay();

    const current = new Date(startDate);
    current.setDate(current.getDate() - startDayOfWeek);

    const weeks: {
      date: string;
      count: number;
      isCurrentYear: boolean;
    }[][] = [];

    const monthLabels: { month: string; weekIndex: number }[] = [];

    let lastMonth = -1;

    while (current <= endDate || current.getDay() !== 0) {
      if (current.getDay() === 0) weeks.push([]);

      const week = weeks[weeks.length - 1];

      const isCurrentYear = current.getFullYear() === selectedYear;
      const dateStr = formatDate(current);

      week.push({
        date: dateStr,
        count: isCurrentYear ? (map.get(dateStr) ?? 0) : 0,
        isCurrentYear,
      });

      if (isCurrentYear && current.getMonth() !== lastMonth) {
        monthLabels.push({
          month: MONTHS[current.getMonth()],
          weekIndex: weeks.length - 1,
        });
        lastMonth = current.getMonth();
      }

      current.setDate(current.getDate() + 1);
    }

    return { weeks, monthLabels };
  }, [data, selectedYear]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Application frequency
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {applicationsThisYear} applications in {selectedYear}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* YEAR SELECTOR */}
        <div className="pt-10">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm font-semibold text-gray-600 bg-transparent outline-none cursor-pointer"
          >
            {availableYears.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* HEATMAP */}
        <div className="flex-1 min-w-0">
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-max flex flex-col gap-3 pr-2">
              {/* MONTH LABELS */}
              <div className="relative h-6 text-[13px] text-gray-500 font-medium">
                {monthLabels.map((label, i) => (
                  <span
                    key={i}
                    className="absolute"
                    style={{ left: `${label.weekIndex * 16}px` }}
                  >
                    {label.month}
                  </span>
                ))}
              </div>

              {/* GRID */}
              <div className="flex gap-[3px]">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {week.map((day, j) => (
                      <div
                        key={j}
                        className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${
                          day.isCurrentYear
                            ? getColor(day.count)
                            : "bg-transparent"
                        }`}
                        title={
                          day.isCurrentYear
                            ? `${day.date}: ${day.count} applications`
                            : undefined
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LEGEND */}
          <div className="mt-6 flex items-center justify-end text-[13px] text-gray-500 gap-3">
            <span className="text-gray-400">Less</span>

            <div className="flex gap-[3px]">
              <div className="w-[13px] h-[13px] rounded-[3px] bg-[#ebedf0]" />
              <div className="w-[13px] h-[13px] rounded-[3px] bg-blue-200" />
              <div className="w-[13px] h-[13px] rounded-[3px] bg-blue-300" />
              <div className="w-[13px] h-[13px] rounded-[3px] bg-blue-400" />
              <div className="w-[13px] h-[13px] rounded-[3px] bg-blue-600" />
            </div>

            <span className="text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
