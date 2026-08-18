"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react"; // Added Loader2 for a nice spinner
import { Column } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { COLUMN_CONFIG } from "./KanbanBoard";
import { updateJob, deleteMultipleJobs } from "@/server/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  async function handleMove(columnId: string) {
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected");
      return;
    }

    setIsMoving(true);
    try {
      await Promise.all(
        selectedJobs.map((jobId) =>
          updateJob(jobId, {
            columnId,
          }),
        ),
      );

      toast.success(`${selectedJobs.length} jobs moved`);
      onDone();
      router.refresh();
    } catch (err) {
      toast.error("Failed to move jobs");
    } finally {
      setIsMoving(false);
    }
  }

  function handleDeleteClick() {
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected");
      return;
    }
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await deleteMultipleJobs(selectedJobs);
      toast.success(
        `${selectedJobs.length} job${selectedJobs.length > 1 ? "s" : ""} deleted`,
      );
      setShowDeleteConfirm(false);
      onDone();
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete jobs");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E5E7EB] bg-[#E7F6FF] px-3 py-2.5 sm:gap-3 sm:px-4">
        <p className="shrink-0 text-sm font-medium text-[#111827]">
          <span className="tabular-nums">{selectedJobs.length}</span>
          <span className="hidden sm:inline">
            {" "}
            job{selectedJobs.length === 1 ? "" : "s"} selected
          </span>
          <span className="sm:hidden"> selected</span>
        </p>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={isMoving || isDeleting}
                className="h-9 gap-2 rounded-lg border-[#E5E7EB] bg-white px-3 text-[#111827] shadow-sm hover:bg-[#F3F4F6] disabled:opacity-70"
              >
                {isMoving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    Move to
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-lg"
            >
              {columns.map((col, i) => (
                <DropdownMenuItem
                  key={col.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm"
                  onClick={() => handleMove(col.id)}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white ${
                      COLUMN_CONFIG[i % COLUMN_CONFIG.length].color
                    }`}
                  >
                    {COLUMN_CONFIG[i % COLUMN_CONFIG.length].icon}
                  </span>
                  {col.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleDeleteClick}
            disabled={isMoving || isDeleting}
            className="h-9 gap-2 rounded-lg bg-[#EF4444] px-3 text-white shadow-sm hover:bg-[#dc2626] disabled:opacity-70"
          >
            Delete
          </Button>

          <Button
            onClick={onDone}
            disabled={isMoving || isDeleting}
            variant="ghost"
            className="h-9 rounded-lg px-3 text-[#6B7280] hover:bg-white hover:text-[#111827]"
          >
            Done
          </Button>
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:max-w-md">
          <DialogTitle className="text-lg font-semibold text-[#111827]">
            Delete {selectedJobs.length} application
            {selectedJobs.length === 1 ? "" : "s"}?
          </DialogTitle>
          <div className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            This removes them from the board along with their notes and dates.
            It cannot be undone.
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="inline-flex min-w-[92px] items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
