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
import { deleteMultipleJobs } from "@/server/actions";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  async function handleMove(columnId: string) {
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected");
      return;
    }

    try {
      await Promise.all(
        selectedJobs.map((jobId) =>
          updateJob(jobId, {
            columnId,
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

  async function handleDelete() {
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected");
      return;
    }

    try {
      await deleteMultipleJobs(selectedJobs);
      toast.success("Jobs deleted");
      onDone();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete jobs");
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

      <Button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white h-9 gap-2 shadow-sm rounded-xl px-3"
      >
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
