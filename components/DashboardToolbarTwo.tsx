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
      <div className="flex justify-end items-center gap-3 my-2 px-4 border-b border-gray-200 pb-2 overflow-x-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isMoving || isDeleting}
              className="gap-2 h-9 shadow-sm rounded-xl px-3 disabled:opacity-70"
            >
              {isMoving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Moving...
                </>
              ) : (
                <>
                  Move jobs
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
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
          onClick={handleDeleteClick}
          disabled={isMoving || isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white h-9 gap-2 shadow-sm rounded-xl px-3 disabled:opacity-70"
        >
          Delete Jobs
        </Button>

        <Button
          onClick={onDone}
          disabled={isMoving || isDeleting}
          className="bg-purple-600 hover:bg-purple-700 text-white h-9 gap-2 shadow-sm rounded-xl px-3"
        >
          Done
        </Button>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Delete Multiple Jobs
          </DialogTitle>
          <div className="mt-2 text-gray-500 text-sm">
            Are you sure you want to delete the{" "}
            <strong>{selectedJobs.length}</strong> selected job application
            {selectedJobs.length !== 1 ? "s" : ""}? This action cannot be
            undone.
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[85px]"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
