"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateJobModal from "@/components/CreateJobModal";
import type { Column } from "@/lib/types";

interface Props {
  boardId: string;
  columns: Column[];
}

export default function DashboardAddJobButton({ boardId, columns }: Props) {
  const [open, setOpen] = useState(false);

  const appliedColumn = columns.find((c) => c.name.toLowerCase() === "applied");

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Add job
      </Button>

      <CreateJobModal
        boardId={boardId}
        columns={columns}
        defaultColumnId={appliedColumn?.id} // ✅ default to Applied
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
