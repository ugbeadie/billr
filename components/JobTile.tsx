"use client";

import { Column, Job } from "@/lib/types";
import { Card } from "./ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import JobDetailsModal from "./JobDetailsModal";

interface JobTileProps {
  job: Job;
  columns: Column[];
  columnColor?: string;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function JobTile({
  job,
  columnColor,
  isSelected,
  toggleSelect,
  columns,
  dragHandleProps,
}: JobTileProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

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
        {...dragHandleProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setSelectedJob(job);
          setOpen(true);
        }}
        className="relative px-3 py-2 rounded-xl shadow-sm min-w-0 border-l-3 cursor-pointer"
        style={{ borderLeftColor: columnHex }}
      >
        {/* Checkmark */}
        {(hovered || isSelected) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSelect(job.id);
            }}
            className="absolute top-3 right-3"
          >
            <div
              className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs ${
                isSelected ? "text-white" : "border-gray-400 bg-white"
              }`}
              style={
                isSelected
                  ? { backgroundColor: columnHex, borderColor: columnHex }
                  : {}
              }
            >
              {isSelected && "✓"}
            </div>
          </button>
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

        {(job.location || job.url) && <div className="my-3 border-t" />}

        {(job.location || job.url) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {/* location or placeholder */}
            {job.location ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="break-words">{job.location}</span>
              </div>
            ) : (
              <div className="w-0" />
            )}

            {/* link */}
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: columnHex }}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </Card>

      <JobDetailsModal
        job={selectedJob}
        open={open}
        onClose={() => setOpen(false)}
        columnColor={columnColor}
        columns={columns}
      />
    </div>
  );
}
