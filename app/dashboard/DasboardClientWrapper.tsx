"use client";

import { useState } from "react";
import type { Board, Column } from "@/lib/types";
import KanbanBoard from "@/components/KanbanBoard";
import DashboardToolbarOne from "@/components/DashboardToolbarOne";
import DashboardToolbarTwo from "@/components/DashboardToolbarTwo";

interface Props {
  board: Board;
  userId: string;
}

export default function DashboardClient({ board, userId }: Props) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

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
        <DashboardToolbarOne boardId={board.id} columns={board.columns} />
      )}

      <KanbanBoard
        board={board}
        userId={userId}
        selectedJobs={selectedJobs}
        toggleJob={toggleJob}
      />
    </>
  );
}
