"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateJobModal from "@/components/CreateJobModal";
import type { Column } from "@/lib/types";
import { ChevronDown, Kanban, LayoutGrid, List, Plus } from "lucide-react";

interface Props {
  boardId: string;
  columns: Column[];
}

export default function DashboardToolbarOne({ boardId, columns }: Props) {
  const [open, setOpen] = useState(false);

  const appliedColumn = columns.find((c) => c.name.toLowerCase() === "applied");

  return (
    <>
      <div className="flex items-center flex-nowrap gap-2 sm:gap-3 my-2 px-3 sm:px-4 border-b border-gray-200 pb-2 overflow-x-auto">
        {/* Search */}
        <div className="w-32 sm:w-56 md:w-72 flex-shrink-0">
          <Input
            placeholder="Search by company or position"
            className="h-9 text-sm"
          />
        </div>

        {/* Right Controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="outline"
            className="h-9 gap-1 sm:gap-2 shadow-sm rounded-xl px-3"
          >
            <span className="hidden sm:inline">Sort by</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-gray-100">
              <Kanban className="h-4 w-4 text-gray-600" />
            </button>

            <button className="p-1.5 rounded-md hover:bg-gray-100">
              <List className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="h-9 gap-2 shadow-sm rounded-xl px-3"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add job</span>
          </Button>
        </div>
      </div>

      <CreateJobModal
        boardId={boardId}
        columns={columns}
        defaultColumnId={appliedColumn?.id}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
