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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CreateJobModal from "./CreateJobModal";
import JobTile from "./JobTile";

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

const COLUMN_CONFIG: ColumnConfig[] = [
  { color: "bg-blue-500", icon: <Calendar className="h-4 w-4" /> },
  { color: "bg-yellow-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-purple-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
  { color: "bg-gray-500", icon: <Ghost className="h-4 w-4" /> },
];

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

function DropToColumn({
  column,
  config,
  sortedColumns,
  selectedJobs,
  toggleJob,
  onAddJob,
}: {
  column: Column;
  config: ColumnConfig;
  sortedColumns: Column[];
  selectedJobs: string[];
  toggleJob: (id: string) => void;
  onAddJob: (columnId: string) => void;
}) {
  const sortedJobs = [...column.jobs].sort((a, b) => a.order - b.order);

  return (
    <Card className="w-[300px] shrink-0 bg-gray-100 rounded-xl p-2 flex flex-col h-[500px] shadow-sm border-0">
      <CardHeader
        className={`${config.color} text-white rounded-xl px-3 py-2 flex flex-row items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          {config.icon}
          <CardTitle className="text-sm font-semibold">{column.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 mt-2 p-0 overflow-y-auto">
        {sortedJobs.map((job) => (
          <DraggableJobTiles
            key={job.id}
            job={{ ...job, columnId: column.id }}
            columns={sortedColumns}
            columnColor={config.color}
            isSelected={selectedJobs.includes(job.id)}
            toggleSelect={toggleJob}
          />
        ))}
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

export default function KanbanBoard({
  board,
  userId,
  selectedJobs,
  toggleJob,
}: KanbanBoardProps) {
  const columns = board.columns || [];
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const [openColumnId, setOpenColumnId] = useState<string | null>(null);

  return (
    <>
      <div className="flex gap-4 overflow-x-auto px-4 ">
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
