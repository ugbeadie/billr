"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateJobModal from "@/components/CreateJobModal";

interface Props {
  boardId: string;
  columnId: string;
}

export default function DashboardAddJobButton({ boardId, columnId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Add job
      </Button>

      <CreateJobModal
        boardId={boardId}
        columnId={columnId}
        defaultStatus="applied"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
