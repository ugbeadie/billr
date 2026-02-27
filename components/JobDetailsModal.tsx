"use client";

import { Job } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  FileText,
  CalendarCheck,
  ExternalLink,
  X,
  Pencil,
} from "lucide-react";

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  columnColor?: string;
}

export default function JobDetailsModal({
  job,
  open,
  onClose,
  columnColor,
}: JobDetailsModalProps) {
  if (!job) return null;

  function getColorValue(twColor?: string) {
    const map: Record<string, string> = {
      "bg-blue-500": "#3b82f6",
      "bg-yellow-500": "#eab308",
      "bg-purple-500": "#a855f7",
      "bg-green-500": "#22c55e",
      "bg-red-500": "#ef4444",
      "bg-gray-500": "#6b7280",
    };
    return twColor ? map[twColor] : "#f97316";
  }

  const accent = getColorValue(columnColor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-[95vw] p-0 rounded-2xl overflow-y-auto max-h-[90vh] bg-[#f5f5f5]"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <div className="p-3 md:px-6 md:pb-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">
              Job Details
            </DialogTitle>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-1.5 text-sm rounded-md text-white flex items-center gap-1 shadow"
                style={{ backgroundColor: accent }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="border-t my-3" />

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left Column */}
            <div className="flex flex-col gap-8 md:w-48 w-full">
              <div className="flex flex-col items-center text-center">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                  style={{ backgroundColor: accent }}
                >
                  {job.company?.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 font-medium">{job.company}</p>
                {job.status && (
                  <span
                    className="mt-2 text-xs px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {job.status}
                  </span>
                )}
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm border px-3 py-1.5 rounded-md w-full sm:w-auto"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Job Post
                  </a>
                ) : (
                  <p className="text-sm mt-8">No job URL available</p>
                )}
              </div>

              <div
                className="bg-white border rounded-lg p-5 flex flex-col items-center justify-center text-center flex-1"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <span className="flex gap-1 items-center justify-center">
                  <CalendarCheck
                    className="h-5 w-5 mb-1"
                    style={{ color: accent }}
                  />
                  <p className="text-sm font-medium text-gray-600">
                    Applied On
                  </p>
                </span>
                <p className="mt-1 text-black text-sm">
                  {job.appliedDate
                    ? new Date(job.appliedDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-6 md:gap-2">
              <h2 className="text-md text-center md:text-start">
                {job.position}
              </h2>

              <div
                className="bg-white border rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-8"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <DetailItem
                  icon={
                    <MapPin className="h-5 w-5" style={{ color: accent }} />
                  }
                  label="Location"
                  value={job.location || "Not specified"}
                />
                <DetailItem
                  icon={
                    <DollarSign className="h-5 w-5" style={{ color: accent }} />
                  }
                  label="Salary"
                  value={job.salary || "Not specified"}
                />
                <DetailItem
                  icon={<Clock className="h-5 w-5" style={{ color: accent }} />}
                  label="Job Type"
                  value={job.jobType || "Not specified"}
                />
                <DetailItem
                  icon={
                    <Briefcase className="h-5 w-5" style={{ color: accent }} />
                  }
                  label="Job Mode"
                  value={job.jobMode || "Not specified"}
                />
              </div>

              {/* Notes Card */}
              <div
                className="bg-white border rounded-lg p-5 flex-1"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5" style={{ color: accent }} />
                  <p className="font-medium">Notes</p>
                </div>
                <p className="text-sm text-black whitespace-pre-wrap flex-1">
                  {job.description ||
                    "No notes added for this job application."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Detail Item */
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm text-black mt-1">{value}</p>
      </div>
    </div>
  );
}
