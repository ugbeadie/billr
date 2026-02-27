"use client";

import { useState } from "react";
import type { Board, Job } from "@/lib/types";
import { ChevronUp, Plus } from "lucide-react";
import JobDetailsModal from "./JobDetailsModal";
import CreateJobModal from "./CreateJobModal";
import clsx from "clsx";
import { COLUMN_CONFIG } from "./KanbanBoard";

export default function JobListView({ board }: { board: Board }) {
  const columns = [...(board.columns || [])].sort((a, b) => a.order - b.order);

  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map((c) => [c.id, true])),
  );

  const [openCreateJobModal, setOpenCreateJobModal] = useState<string | null>(
    null,
  );

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedColumnColor, setSelectedColumnColor] = useState<string>();

  function toggleColumn(id: string) {
    setOpenColumns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <>
      <div className="space-y-4 px-4">
        {columns.map((column, index) => {
          const jobs = [...column.jobs].sort((a, b) => a.order - b.order);
          const headerBg = COLUMN_CONFIG[index % COLUMN_CONFIG.length].color;

          return (
            <div key={column.id} className="rounded-xl overflow-hidden">
              {/* HEADER  */}
              <div
                role="button"
                onClick={() => toggleColumn(column.id)}
                className={clsx(
                  "flex items-center justify-between px-4 py-2 text-white rounded-xl cursor-pointer select-none",
                  headerBg,
                )}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <ChevronUp
                    className={clsx(
                      "h-6 w-6 transition-transform",
                      openColumns[column.id] === false && "rotate-180",
                    )}
                  />
                  {column.name}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCreateJobModal(column.id);
                  }}
                  className="h-6 w-6 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* CONTENT */}
              {openColumns[column.id] && (
                <div className="bg-white rounded-xl mt-2 border overflow-hidden">
                  {jobs.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No jobs in this column
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="min-w-[720px]">
                        {/* table header */}
                        <div className="grid grid-cols-[1fr_1.5fr_1fr_80px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                          <div>COMPANY</div>
                          <div>POSITION</div>
                          <div>APPLIED ON</div>
                          <div />
                        </div>

                        {/* rows */}
                        {jobs.map((job, rowIndex) => (
                          <div
                            key={job.id}
                            className={clsx(
                              "grid grid-cols-[1fr_1.5fr_1fr_80px] gap-4 px-4 py-3 text-sm text-black items-center border-b last:border-b-0 hover:bg-gray-50",
                              rowIndex % 2 === 0
                                ? "bg-transparent"
                                : "bg-gray-100",
                            )}
                          >
                            <div className="font-medium">{job.company}</div>
                            <div>{job.position}</div>
                            <div className="text-muted-foreground">
                              {job.appliedDate
                                ? new Date(job.appliedDate).toLocaleDateString()
                                : "-"}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedJob({
                                  ...job,
                                  columnId: column.id,
                                });
                                setSelectedColumnColor(headerBg);
                              }}
                              className={clsx(
                                "px-3 py-1 rounded-md text-xs font-medium text-white",
                                headerBg,
                              )}
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openCreateJobModal && (
        <CreateJobModal
          boardId={board.id}
          columns={columns}
          defaultColumnId={openCreateJobModal}
          open={true}
          onOpenChange={(open) => {
            if (!open) setOpenCreateJobModal(null);
          }}
        />
      )}

      <JobDetailsModal
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        columnColor={selectedColumnColor}
      />
    </>
  );
}
