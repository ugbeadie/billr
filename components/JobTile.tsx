import { Column, Job } from "@/lib/types";
import { Card } from "./ui/card";
import { MapPin, ExternalLink } from "lucide-react";

interface JobTileProps {
  job: Job;
  columns: Column[];
  columnColor?: string;
}

export default function JobTile({ job, columnColor }: JobTileProps) {
  function getColorValue(twColor?: string) {
    const map: Record<string, string> = {
      "bg-blue-500": "#3b82f6",
      "bg-yellow-500": "#eab308",
      "bg-purple-500": "#a855f7",
      "bg-green-500": "#22c55e",
      "bg-red-500": "#ef4444",
      "bg-gray-500": "#6b7280",
    };

    return twColor ? map[twColor] : "#e5e7eb";
  }

  const columnHex = getColorValue(columnColor);

  function getJobTypeColor(type?: string) {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-700";
      case "part-time":
        return "bg-blue-100 text-blue-700";
      case "contract":
        return "bg-purple-100 text-purple-700";
      case "internship":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getJobModeColor(mode?: string) {
    switch (mode?.toLowerCase()) {
      case "remote":
        return "bg-indigo-100 text-indigo-700";
      case "hybrid":
        return "bg-yellow-100 text-yellow-800";
      case "on-site":
      case "onsite":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="mb-2 min-w-0">
      <Card
        className="relative p-3 rounded-xl shadow-sm min-w-0 border-l-4"
        style={{ borderLeftColor: columnHex }}
      >
        {/* 🔗 URL Icon */}
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 transition-opacity hover:opacity-70"
            style={{ color: columnHex }}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <p className="text-sm font-medium text-muted-foreground">
          {job.company}
        </p>

        <h3 className="text-sm font-semibold mt-0.5 break-words pr-6">
          {job.position}
        </h3>

        {(job.jobType || job.jobMode) && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {job.jobType && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getJobTypeColor(
                  job.jobType,
                )}`}
              >
                {job.jobType}
              </span>
            )}

            {job.jobMode && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getJobModeColor(
                  job.jobMode,
                )}`}
              >
                {job.jobMode}
              </span>
            )}
          </div>
        )}

        <div className="my-3 border-t" />

        {job.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">{job.location}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
