"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Column } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { COLUMN_CONFIG } from "./KanbanBoard";
import { updateJob } from "@/server/actions";
import { toast } from "sonner";

interface ToolbarTwoProps {
  selectedJobs: string[];
  columns: Column[];
  onDone: () => void;
}

export default function DashboardToolbarTwo({
  selectedJobs,
  columns,
  onDone,
}: ToolbarTwoProps) {
  async function handleMove(columnId: string) {
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected");
      return;
    }

    try {
      await Promise.all(
        selectedJobs.map((jobId) =>
          updateJob(jobId, {
            columnId, // no order → backend puts it at the end
          }),
        ),
      );

      toast.success("Jobs moved");
      onDone();
    } catch (err) {
      console.error(err);
      toast.error("Failed to move jobs");
    }
  }

  return (
    <div className="flex justify-end items-center gap-3 my-2 px-4 border-b border-gray-200 pb-2 overflow-x-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 h-9 shadow-sm rounded-xl px-3"
          >
            Move jobs
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-white shadow-md rounded-md p-1"
        >
          {columns.map((col, i) => (
            <DropdownMenuItem
              key={col.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleMove(col.id)}
            >
              {COLUMN_CONFIG[i % COLUMN_CONFIG.length].icon}
              {col.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className="bg-red-500 hover:bg-red-600 text-white h-9 gap-2 shadow-sm rounded-xl px-3">
        Delete Jobs
      </Button>

      <Button
        onClick={onDone}
        className="bg-purple-600 hover:bg-purple-700 text-white h-9 gap-2 shadow-sm rounded-xl px-3"
      >
        Done
      </Button>
    </div>
  );
}
