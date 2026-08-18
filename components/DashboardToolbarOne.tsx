"use client";

import { Input } from "@/components/ui/input";
import { Kanban, List, Loader2, Play, Plus, Search, X } from "lucide-react";
import { Column } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolbarOneProps {
  boardId: string;
  columns: Column[];
  userId: string;
  view: "kanban" | "list";
  onViewChange: (v: "kanban" | "list") => void;
  onAddJob: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardToolbarOne({
  userId,
  view,
  onViewChange,
  onAddJob,
  search,
  onSearchChange,
}: ToolbarOneProps) {
  const [isTourLoading, setIsTourLoading] = useState(false);

  const handleReplayTour = async () => {
    setIsTourLoading(true);
    localStorage.removeItem(`tourCompleted-${userId}`);
    await new Promise((r) => setTimeout(r, 500));
    location.reload();
  };

  return (
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto border-b border-[#E5E7EB] px-3 py-2.5 sm:gap-3 sm:px-4">
      {/* Search */}
      <div className="relative w-36 shrink-0 sm:w-64 md:w-80">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
          aria-hidden
        />
        <Input
          id="search-jobs"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by company or position"
          aria-label="Search by company or position"
          className="h-9 rounded-lg border-[#E5E7EB] bg-white pl-9 pr-8 text-sm placeholder:text-[#9CA3AF] focus-visible:border-[#3A9AFF] focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/25"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#9CA3AF] transition-colors hover:text-[#111827]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <IconButton
          title="Replay tour"
          onClick={handleReplayTour}
          disabled={isTourLoading}
        >
          {isTourLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#3A9AFF]" />
          ) : (
            <Play className="h-4 w-4 text-[#3A9AFF]" />
          )}
        </IconButton>

        {/* View toggle — one segmented control rather than two loose buttons */}
        <div
          id="view-toggle"
          role="group"
          aria-label="Board view"
          className="flex items-center gap-0.5 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-0.5"
        >
          <SegmentButton
            title="Kanban view"
            active={view === "kanban"}
            onClick={() => onViewChange("kanban")}
          >
            <Kanban className="h-4 w-4" />
          </SegmentButton>

          <SegmentButton
            title="List view"
            active={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <List className="h-4 w-4" />
          </SegmentButton>
        </div>

        {/* Add job — the primary action, so it reads like one */}
        <button
          id="add-job-btn"
          type="button"
          onClick={onAddJob}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#3A9AFF] px-3 text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add job</span>
          <span className="sr-only sm:hidden">Add job</span>
        </button>
      </div>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-[#E5E7EB] hover:bg-[#F3F4F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SegmentButton({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50",
        active
          ? "bg-white text-[#3A9AFF] shadow-sm"
          : "text-[#6B7280] hover:text-[#111827]",
      )}
    >
      {children}
    </button>
  );
}
