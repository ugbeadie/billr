import type { ReactNode } from "react";
import { Award, CheckCircle2, Ghost, Mic, Star, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import MockJobCard from "./MockJobCard";
import { STATUS, type MockJob, type StatusKey } from "./data";

/** Static twin of the column in KanbanBoard.tsx:313-391. */
const ICONS: Record<StatusKey, typeof Star> = {
  wishlist: Star,
  applied: CheckCircle2,
  interviewing: Mic,
  offer: Award,
  rejected: XCircle,
  ghosted: Ghost,
};

export default function MockColumn({
  status,
  jobs,
  count,
  height = "h-[420px]",
  scroll = true,
  showAdd = true,
  empty = false,
  liftRoom = false,
  children,
  className,
}: {
  status: StatusKey;
  jobs: MockJob[];
  count?: number;
  height?: string;
  scroll?: boolean;
  showAdd?: boolean;
  /** Renders the zero state from KanbanBoard.tsx:344-360. */
  empty?: boolean;
  /** Extends the clip box upward so a first card mid-drop can lift uncut. */
  liftRoom?: boolean;
  /** Rendered above the cards — used for the hero's just-dropped card. */
  children?: ReactNode;
  className?: string;
}) {
  const { label, hex } = STATUS[status];
  const Icon = ICONS[status];
  const total = count ?? jobs.length;

  return (
    <div
      className={cn(
        "flex w-68 shrink-0 flex-col rounded-xl bg-[#F3F4F6] p-2 shadow-sm",
        height,
        className,
      )}
    >
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-white"
        style={{ backgroundColor: hex }}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-sm font-semibold">
          {label}
          {total > 0 && ` (${total})`}
        </span>
      </div>

      <div
        className={cn(
          "flex-1 space-y-2",
          liftRoom ? "-mt-3 pt-5" : "mt-2",
          // overflow-x-hidden explicitly, so the tilted card mid-drop can't
          // open a horizontal scrollbar inside the column.
          scroll ? "overflow-y-auto overflow-x-hidden" : "overflow-visible",
        )}
      >
        {children}

        {empty && (
          <div className="flex h-22.5 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/50 px-3 text-center">
            <p className="text-xs text-gray-500">No jobs here yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Add a job or drag one here
            </p>
          </div>
        )}

        {jobs.map((job) => (
          <MockJobCard key={job.id} job={job} accent={hex} />
        ))}
      </div>

      {showAdd && (
        <div className="mt-3 rounded-xl bg-white py-2 text-center text-sm font-medium text-gray-600">
          + Add job
        </div>
      )}
    </div>
  );
}
