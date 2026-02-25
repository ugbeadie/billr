"use client";

import React from "react";
import { useState } from "react";
import type { Board, Column, Job } from "@/lib/types";
import {
  Calendar,
  CheckCircle2,
  Mic,
  Award,
  XCircle,
  Ghost,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CreateJobModal from "./CreateJobModal";
import JobTile from "./JobTile";

type KanbanBoardProps = {
  board: Board;
  userId: string;
};

interface ColumnConfig {
  color: string;
  icon: React.ReactNode;
}
const COLUMN_CONFIG: Array<ColumnConfig> = [
  {
    color: "bg-blue-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    color: "bg-gray-500",
    icon: <Ghost className="h-4 w-4" />,
  },
];

function DraggableJobTiles({
  job,
  columns,
  columnColor,
}: {
  job: Job;
  columns: Column[];
  columnColor: string;
}) {
  return (
    <JobTile
      key={job.id}
      job={job}
      columns={columns}
      columnColor={columnColor}
    />
  );
}

function DropToColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColumnConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const [open, setOpen] = useState(false);

  console.log("Column data:", column);

  const sortedJobs = [...column.jobs].sort((a, b) => a.order - b.order);
  return (
    <>
      <Card className="w-[320px] shrink-0 bg-gray-100 rounded-xl p-2 flex flex-col h-125 shadow-sm border-0">
        <CardHeader
          className={`${config.color} text-white rounded-xl px-3 py-2 flex flex-row items-center justify-between space-y-0`}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-sm font-semibold text-white">
              {column.name}
            </CardTitle>
          </div>

          {/* <Settings className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" /> */}
        </CardHeader>

        <CardContent className="flex-1 mt-2 p-0 overflow-y-auto">
          {sortedJobs.map((job) => (
            <DraggableJobTiles
              key={job.id}
              job={{ ...job, columnId: column.id || column.id }}
              columns={sortedColumns}
              columnColor={config.color}
            />
          ))}
        </CardContent>

        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className="mt-3 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          + Add job
        </Button>
      </Card>

      <CreateJobModal
        columns={sortedColumns}
        boardId={boardId}
        defaultColumnId={column.id}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const columns = board?.columns || [];
  console.log("Board columns:", columns);
  const sortedColumns = columns?.sort((a, b) => a.order - b.order);

  return (
    <div>
      {columns.map((column, index) => {
        const config = COLUMN_CONFIG[index % COLUMN_CONFIG.length];
        return (
          <DropToColumn
            key={column.id}
            column={column}
            config={config}
            boardId={board!.id}
            sortedColumns={sortedColumns}
          />
        );
      })}
    </div>
  );
}
