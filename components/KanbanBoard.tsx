"use client";

import React, { useEffect, useState } from "react";
import type { Board, Column, Job } from "@/lib/types";
import { CheckCircle2, Mic, Award, XCircle, Ghost, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CreateJobModal from "./CreateJobModal";
import JobTile from "./JobTile";
import { motion } from "framer-motion";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  DragOverlay,
  DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateJob } from "@/server/actions";

type Props = {
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

export default function KanbanBoard({ board, selectedJobs, toggleJob }: Props) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<{
    columnId: string;
    index: number;
  } | null>(null);
  const [openColumnId, setOpenColumnId] = useState<string | null>(null);

  useEffect(() => {
    if (!board.columns) return;

    const ordered = board.columns
      .map((col) => ({
        ...col,
        jobs: [...col.jobs].sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.order - b.order);

    setColumns(ordered);
  }, [board.columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const anyJobSelected = selectedJobs.length > 0;

  async function moveJobs(
    jobIds: string[],
    targetColumnId: string,
    targetIndex: number,
  ) {
    setColumns((prev) => {
      const clone = prev.map((col) => ({ ...col, jobs: [...col.jobs] }));
      const moving: Job[] = [];

      clone.forEach((col) => {
        col.jobs = col.jobs.filter((j) => {
          if (jobIds.includes(j.id)) {
            moving.push(j);
            return false;
          }
          return true;
        });
      });

      const target = clone.find((c) => c.id === targetColumnId);
      if (!target) return prev;

      target.jobs.splice(targetIndex, 0, ...moving);

      target.jobs = target.jobs.map((j, i) => ({
        ...j,
        columnId: targetColumnId,
        order: i * 100,
      }));

      return clone;
    });

    await Promise.all(
      jobIds.map((id, i) =>
        updateJob(id, { columnId: targetColumnId, order: targetIndex + i }),
      ),
    );
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { over } = event;
    if (!over) {
      setPlaceholder(null);
      return;
    }

    for (const col of columns) {
      const index = col.jobs.findIndex((j) => j.id === over.id);

      if (col.id === over.id) {
        setPlaceholder({ columnId: col.id, index: col.jobs.length });
        return;
      }

      if (index !== -1) {
        setPlaceholder({ columnId: col.id, index });
        return;
      }
    }

    setPlaceholder(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Determine which jobs are being dragged
    const draggingIds = selectedJobs.includes(active.id as string)
      ? selectedJobs
      : [active.id as string];

    setPlaceholder(null);
    setActiveId(null);

    if (!over) return;

    let targetColumn: Column | undefined;
    let targetIndex = 0;

    for (const col of columns) {
      const index = col.jobs.findIndex((j) => j.id === over.id);

      if (col.id === over.id) {
        targetColumn = col;
        targetIndex = col.jobs.length;
        break;
      }

      if (index !== -1) {
        targetColumn = col;
        targetIndex = index;
        break;
      }
    }

    if (!targetColumn) return;

    await moveJobs(draggingIds, targetColumn.id, targetIndex);
  }

  const activeJobs =
    activeId && selectedJobs.includes(activeId)
      ? columns
          .flatMap((c) => c.jobs)
          .filter((j) => selectedJobs.includes(j.id))
      : columns.flatMap((c) => c.jobs).filter((j) => j.id === activeId);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div id="kanban-board" className="flex gap-4 overflow-x-auto px-4">
          {columns.map((column, index) => (
            <ColumnComponent
              key={column.id}
              column={column}
              columns={columns}
              config={COLUMN_CONFIG[index % COLUMN_CONFIG.length]}
              selectedJobs={selectedJobs}
              toggleJob={toggleJob}
              placeholder={placeholder}
              anyJobSelected={anyJobSelected}
              activeId={activeId}
              onAddJob={setOpenColumnId}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeJobs.length > 0 && (
            <motion.div
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="space-y-2 w-72"
            >
              {activeJobs.map((job) => (
                <JobTile
                  key={job.id}
                  job={job}
                  columns={columns}
                  columnColor="bg-gray-500"
                  isSelected
                  toggleSelect={toggleJob}
                />
              ))}
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>

      {openColumnId && (
        <CreateJobModal
          columns={columns}
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

function ColumnComponent({
  column,
  columns,
  config,
  selectedJobs,
  toggleJob,
  placeholder,
  anyJobSelected,
  activeId,
  onAddJob,
}: {
  column: Column;
  columns: Column[];
  config: { color: string; icon: React.ReactNode };
  selectedJobs: string[];
  toggleJob: (id: string) => void;
  placeholder: { columnId: string; index: number } | null;
  anyJobSelected: boolean;
  activeId: string | null;
  onAddJob: (columnId: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const allSelectedInColumn =
    column.jobs.length > 0 &&
    column.jobs.every((job: Job) => selectedJobs.includes(job.id));

  function handleSelectAll(e: React.MouseEvent) {
    e.stopPropagation();

    if (allSelectedInColumn) {
      column.jobs.forEach((job: Job) => {
        if (selectedJobs.includes(job.id)) toggleJob(job.id);
      });
    } else {
      column.jobs.forEach((job: Job) => {
        if (!selectedJobs.includes(job.id)) toggleJob(job.id);
      });
    }
  }

  return (
    <Card className="w-72 shrink-0 bg-gray-100 rounded-xl p-2 flex flex-col h-[500px] shadow-sm border-0">
      <CardHeader
        className={`${config.color} text-white rounded-xl px-3 py-2 flex flex-row items-center justify-between`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {config.icon}
          <CardTitle className="text-sm font-semibold whitespace-nowrap">
            {column.name}{" "}
            {column.jobs.length !== 0 && `(${column.jobs.length})`}
          </CardTitle>
        </div>

        {anyJobSelected && (
          <button
            onClick={handleSelectAll}
            className="ml-2 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-xs border-white bg-white text-black hover:bg-gray-200"
          >
            {allSelectedInColumn && "✓"}
          </button>
        )}
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className="flex-1 mt-2 p-0 overflow-y-auto space-y-2"
      >
        <SortableContext
          items={column.jobs.map((j: Job) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.jobs.length === 0 && (
            <div
              id="job-tile"
              className="
        flex flex-col items-center justify-center
        h-[90px] rounded-xl border-2 border-dashed
        border-gray-300 bg-white/50
        text-center px-3
      "
            >
              <p className="text-xs text-gray-500">No jobs here yet</p>

              <p className="text-xs text-gray-400 mt-1">
                Add a job or drag one here
              </p>
            </div>
          )}

          {column.jobs.map((job: Job, index: number) => (
            <React.Fragment key={job.id}>
              {placeholder &&
                activeId &&
                placeholder.columnId === column.id &&
                placeholder.index === index && (
                  <div className="h-[72px] mb-2 opacity-0" />
                )}

              <DraggableJob
                job={job}
                columnColor={config.color}
                isSelected={selectedJobs.includes(job.id)}
                toggleSelect={toggleJob}
                columns={columns}
              />
            </React.Fragment>
          ))}
        </SortableContext>
      </CardContent>

      <Button
        className="tour-add-column mt-3 rounded-xl text-sm font-medium bg-white hover:bg-gray-200 text-gray-600"
        onClick={() => onAddJob(column.id)}
        variant="secondary"
      >
        + Add job
      </Button>
    </Card>
  );
}

function DraggableJob({
  job,
  columnColor,
  isSelected,
  toggleSelect,
  columns,
}: {
  job: Job;
  columnColor: string;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      <JobTile
        job={job}
        columnColor={columnColor}
        isSelected={isSelected}
        toggleSelect={toggleSelect}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
}
