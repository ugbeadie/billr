"use client";

import { useState } from "react";
import type { Board } from "@/lib/types";

import KanbanBoard from "@/components/KanbanBoard";
import DashboardToolbarOne from "@/components/DashboardToolbarOne";
import DashboardToolbarTwo from "@/components/DashboardToolbarTwo";
import JobListView from "@/components/JobListView";

interface Props {
  board: Board;
  userId: string;
}

export default function DashboardClient({ board, userId }: Props) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  function toggleJob(id: string) {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id],
    );
  }

  function clearSelection() {
    setSelectedJobs([]);
  }

  return (
    <>
      {/* TOOLBARS */}
      {selectedJobs.length > 0 ? (
        <DashboardToolbarTwo
          selectedJobs={selectedJobs}
          columns={board.columns}
          onDone={clearSelection}
        />
      ) : (
        <DashboardToolbarOne
          boardId={board.id}
          columns={board.columns}
          view={view}
          onViewChange={setView}
        />
      )}

      {/* CONTENT */}
      {view === "kanban" ? (
        <KanbanBoard
          board={board}
          userId={userId}
          selectedJobs={selectedJobs}
          toggleJob={toggleJob}
        />
      ) : (
        <JobListView board={board} />
      )}
    </>
  );
}
