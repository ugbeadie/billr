"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Kanban, List, Play, Plus, Search } from "lucide-react";
import { Column } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface ToolbarOneProps {
  boardId: string;
  columns: Column[];
  view: "kanban" | "list";
  onViewChange: (v: "kanban" | "list") => void;
  onAddJob: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardToolbarOne({
  view,
  onViewChange,
  onAddJob,
  search,
  onSearchChange,
}: ToolbarOneProps) {
  const [showReplay, setShowReplay] = useState(false);
  const [isTourLoading, setIsTourLoading] = useState(false);
  useEffect(() => {
    const completed = localStorage.getItem("tourCompleted");
    setShowReplay(!completed);
  }, []);

  const handleReplayTour = async () => {
    setIsTourLoading(true);
    localStorage.removeItem("tourCompleted");
    await new Promise((r) => setTimeout(r, 500)); // optional small delay for UX
    location.reload();
  };

  return (
    <div className="flex items-center flex-nowrap gap-2 sm:gap-3 my-2 px-3 sm:px-4 border-b border-gray-200 pb-2 overflow-x-auto">
      {/* Search */}
      <div className="w-32 sm:w-56 md:w-72 flex-shrink-0 relative">
        <Search className="text-primary absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id="search-jobs"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by company or position"
          className="h-9 text-sm pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          title="Replay Tour"
          onClick={handleReplayTour}
          className="p-1.5 rounded-md hover:bg-gray-100 transition flex items-center"
        >
          {isTourLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          ) : (
            <Play className="h-4 w-4 text-primary" />
          )}
        </button>

        {/* Sort by Dropdown */}
        {/* <DropdownMenu>
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
        </DropdownMenu> */}

        {/* <div className="h-5 w-px bg-gray-200 hidden sm:block" /> */}

        {/* View toggle */}
        <div id="view-toggle" className="flex items-center gap-1">
          <button
            title="Kanban view"
            onClick={() => onViewChange("kanban")}
            className={`p-1.5 rounded-md transition
      ${
        view === "kanban"
          ? "border border-primary bg-primary/5"
          : "border border-transparent hover:bg-gray-100"
      }`}
          >
            <Kanban
              className={`h-4 w-4 ${
                view === "kanban" ? "text-primary" : "text-gray-600"
              }`}
            />
          </button>

          <button
            title="List view"
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-md transition
      ${
        view === "list"
          ? "border border-primary bg-primary/5"
          : "border border-transparent hover:bg-gray-100"
      }`}
          >
            <List
              className={`h-4 w-4 ${
                view === "list" ? "text-primary" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Add Job */}
        <Button
          id="add-job-btn"
          onClick={onAddJob}
          variant="outline"
          className="h-9 gap-2 shadow-sm rounded-xl px-3"
        >
          <Plus className="h-4 w-4 text-primary" />
          <span className="hidden text-primary sm:inline">Add job</span>
        </Button>
      </div>
    </div>
  );
}
