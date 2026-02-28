"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Kanban, List, Plus, Search } from "lucide-react";
import { Column } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ToolbarOneProps {
  boardId: string;
  columns: Column[];
  view: "kanban" | "list";
  onViewChange: (v: "kanban" | "list") => void;
  onAddJob: () => void;
}

export default function DashboardToolbarOne({
  boardId,
  columns,
  view,
  onViewChange,
  onAddJob,
}: ToolbarOneProps) {
  return (
    <div className="flex items-center flex-nowrap gap-2 sm:gap-3 my-2 px-3 sm:px-4 border-b border-gray-200 pb-2 overflow-x-auto">
      {/* Search */}
      <div className="w-32 sm:w-56 md:w-72 flex-shrink-0 relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by company or position"
          className="h-9 text-sm pl-8"
        />
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Sort by Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-1 sm:gap-2 shadow-sm rounded-xl px-3"
            >
              <span className="hidden sm:inline">Sort by</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-36 bg-white shadow-md rounded-md p-1"
          >
            <DropdownMenuItem>Newest</DropdownMenuItem>
            <DropdownMenuItem>Oldest</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* View toggle */}
        <div className="flex items-center gap-1">
          <button
            title="Kanban view"
            onClick={() => onViewChange("kanban")}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <Kanban
              className={`h-4 w-4 ${view === "kanban" ? "text-primary" : "text-gray-600"}`}
            />
          </button>
          <button
            title="List view"
            onClick={() => onViewChange("list")}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <List
              className={`h-4 w-4 ${view === "list" ? "text-primary" : "text-gray-600"}`}
            />
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Add job */}
        <Button
          onClick={onAddJob}
          variant="outline"
          className="h-9 gap-2 shadow-sm rounded-xl px-3"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add job</span>
        </Button>
      </div>
    </div>
  );
}
