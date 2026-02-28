"use client";

import React, { useState } from "react";
import type { Board, Column, Job } from "@/lib/types";
import {
  Calendar,
  CheckCircle2,
  Mic,
  Award,
  XCircle,
  Ghost,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CreateJobModal from "./CreateJobModal";
import JobTile from "./JobTile";
import { AnimatePresence, motion } from "framer-motion";

type KanbanBoardProps = {
  board: Board;
  userId: string;
  selectedJobs: string[];
  toggleJob: (id: string) => void;
};

interface ColumnConfig {
  color: string;
  icon: React.ReactNode;
}

export const COLUMN_CONFIG: ColumnConfig[] = [
  { color: "bg-blue-500", icon: <Star className="h-4 w-4" /> },
  { color: "bg-yellow-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-purple-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
  { color: "bg-gray-500", icon: <Ghost className="h-4 w-4" /> },
];

export default function KanbanBoard({
  board,
  userId,
  selectedJobs,
  toggleJob,
}: KanbanBoardProps) {
  const columns = board.columns || [];
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const [openColumnId, setOpenColumnId] = useState<string | null>(null);

  const anyJobSelected = selectedJobs.length > 0;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto px-4">
        {sortedColumns.map((column, index) => {
          const config = COLUMN_CONFIG[index % COLUMN_CONFIG.length];

          return (
            <DropToColumn
              key={column.id}
              column={column}
              config={config}
              sortedColumns={sortedColumns}
              selectedJobs={selectedJobs}
              toggleJob={toggleJob}
              onAddJob={setOpenColumnId}
              anyJobSelected={anyJobSelected} // pass it here
            />
          );
        })}
      </div>

      {openColumnId && (
        <CreateJobModal
          columns={sortedColumns}
          boardId={board.id}
          defaultColumnId={openColumnId}
          open={!!openColumnId}
          onOpenChange={(open) => {
            if (!open) setOpenColumnId(null);
          }}
        />
      )}
    </>
  );
}

function DropToColumn({
  column,
  config,
  sortedColumns,
  selectedJobs,
  toggleJob,
  onAddJob,
  anyJobSelected,
}: {
  column: Column;
  config: ColumnConfig;
  sortedColumns: Column[];
  selectedJobs: string[];
  toggleJob: (id: string) => void;
  onAddJob: (columnId: string) => void;
  anyJobSelected: boolean;
}) {
  const sortedJobs = [...column.jobs].sort((a, b) => a.order - b.order);

  // Check if all jobs in this column are selected
  const allSelectedInColumn =
    sortedJobs.length > 0 &&
    sortedJobs.every((job) => selectedJobs.includes(job.id));

  const handleSelectAllColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allSelectedInColumn) {
      // Deselect all jobs in this column
      sortedJobs.forEach((job) => {
        if (selectedJobs.includes(job.id)) toggleJob(job.id);
      });
    } else {
      // Select all jobs in this column
      sortedJobs.forEach((job) => {
        if (!selectedJobs.includes(job.id)) toggleJob(job.id);
      });
    }
  };

  return (
    <Card className="w-75 shrink-0 bg-gray-100 rounded-xl p-2 flex flex-col h-125 shadow-sm border-0">
      <CardHeader
        className={`${config.color} text-white rounded-xl px-3 py-2 flex flex-row items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-sm font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <p className="text-sm font-semibold text-white">
            ({sortedJobs.length})
          </p>
        </div>

        {anyJobSelected && (
          <button
            onClick={handleSelectAllColumn}
            className="h-5 w-5 rounded-full border flex items-center justify-center text-xs border-white bg-white text-black hover:bg-gray-200"
          >
            {allSelectedInColumn && "✓"}
          </button>
        )}
      </CardHeader>

      <CardContent className="flex-1 mt-2 p-0 overflow-y-auto">
        <AnimatePresence>
          {sortedJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <DraggableJobTiles
                job={{ ...job, columnId: column.id }}
                columns={sortedColumns}
                columnColor={config.color}
                isSelected={selectedJobs.includes(job.id)}
                toggleSelect={toggleJob}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>

      <Button
        onClick={() => onAddJob(column.id)}
        variant="secondary"
        className="mt-3 rounded-xl text-sm font-medium bg-white hover:bg-gray-200 text-gray-600"
      >
        + Add job
      </Button>
    </Card>
  );
}

function DraggableJobTiles({
  job,
  columns,
  columnColor,
  isSelected,
  toggleSelect,
}: {
  job: Job;
  columns: Column[];
  columnColor: string;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
}) {
  return (
    <JobTile
      job={job}
      columns={columns}
      columnColor={columnColor}
      isSelected={isSelected}
      toggleSelect={toggleSelect}
    />
  );
}
