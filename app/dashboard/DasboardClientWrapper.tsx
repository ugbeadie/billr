"use client";

import { useState, useMemo } from "react";
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
  const [search, setSearch] = useState("");

  function toggleJob(id: string) {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id],
    );
  }

  function clearSelection() {
    setSelectedJobs([]);
  }

  const processedBoard = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return {
      ...board,
      columns: board.columns.map((column) => {
        let jobs = [...column.jobs];

        if (search.trim()) {
          jobs = jobs.filter(
            (job) =>
              job.company.toLowerCase().includes(lowerSearch) ||
              job.position.toLowerCase().includes(lowerSearch),
          );
        }

        return {
          ...column,
          jobs,
        };
      }),
    };
  }, [board, search]);

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
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {view === "kanban" ? (
        <KanbanBoard
          board={processedBoard}
          userId={userId}
          selectedJobs={selectedJobs}
          toggleJob={toggleJob}
        />
      ) : (
        <JobListView board={processedBoard} />
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
