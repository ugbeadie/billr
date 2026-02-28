"use client";

import { useState } from "react";
import type { Board } from "@/lib/types";

import KanbanBoard from "@/components/KanbanBoard";
import DashboardToolbarOne from "@/components/DashboardToolbarOne";
import DashboardToolbarTwo from "@/components/DashboardToolbarTwo";
import JobListView from "@/components/JobListView";
import CreateJobModal from "@/components/CreateJobModal";

interface Props {
  board: Board;
  userId: string;
}

export default function DashboardClient({ board, userId }: Props) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [defaultColumnId, setDefaultColumnId] = useState<string>("");

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
          onAddJob={() => {
            const appliedColumn = board.columns.find(
              (c) => c.name.toLowerCase() === "applied",
            );

            setDefaultColumnId(appliedColumn?.id ?? "");
            setOpenCreateJob(true);
          }}
        />
      )}

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

      <CreateJobModal
        open={openCreateJob}
        onOpenChange={setOpenCreateJob}
        boardId={board.id}
        columns={board.columns}
        defaultColumnId={defaultColumnId}
      />
    </>
  );
}
