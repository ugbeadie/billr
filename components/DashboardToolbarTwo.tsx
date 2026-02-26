"use client";

import { Button } from "@/components/ui/button";
import type { Column } from "@/lib/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  selectedJobs: string[];
  columns: Column[];
  onDone: () => void;
}

export default function DashboardToolbarTwo({
  selectedJobs,
  columns,
  onDone,
}: Props) {
  return (
    <div className="flex justify-end items-center gap-3 my-2 px-4 border-b border-gray-200 pb-2 overflow-x-auto">
      <div className="relative">
        <Button
          variant="outline"
          className="gap-2 h-9  shadow-sm rounded-xl px-3"
        >
          Move jobs
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Button className="bg-red-500 hover:bg-red-600 text-white h-9 gap-2 shadow-sm rounded-xl px-3">
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
