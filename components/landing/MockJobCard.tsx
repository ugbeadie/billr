import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  jobModeClasses,
  jobModeLabel,
  jobTypeClasses,
  jobTypeLabel,
  type MockJob,
} from "./data";

/** Static twin of JobTile.tsx:83-187. */
export default function MockJobCard({
  job,
  accent,
  className,
  compact = false,
}: {
  job: MockJob;
  accent: string;
  className?: string;
  compact?: boolean;
}) {
  const hasMeta = Boolean(job.jobType || job.jobMode);
  const hasFooter = Boolean(job.location || job.url);

  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-sm",
        className,
      )}
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <p className="text-sm font-medium text-[#6B7280] break-words">
        {job.company}
      </p>

      <h3 className="mt-0.5 text-sm font-semibold text-[#111827] break-words">
        {job.position}
      </h3>

      {job.salary && (
        <p className="mt-1 text-xs font-medium text-[#111827] tabular-nums">
          {job.salary}
        </p>
      )}

      {job.appliedDate && !compact && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6B7280]">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{job.appliedDate}</span>
        </div>
      )}

      {hasMeta && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.jobType && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                jobTypeClasses(job.jobType),
              )}
            >
              {jobTypeLabel(job.jobType)}
            </span>
          )}
          {job.jobMode && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                jobModeClasses(job.jobMode),
              )}
            >
              {jobModeLabel(job.jobMode)}
            </span>
          )}
        </div>
      )}

      {hasFooter && !compact && (
        <>
          <div className="my-2.5 border-t border-[#E5E7EB]" />
          <div className="flex items-center justify-between gap-2 text-xs text-[#6B7280]">
            {job.location ? (
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="break-words">{job.location}</span>
              </span>
            ) : (
              <span />
            )}
            {job.url && (
              <ExternalLink
                className="h-4 w-4 shrink-0"
                style={{ color: accent }}
                aria-hidden
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
