import { Column, Job } from "@/lib/types";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";

interface JobTileProps {
  job: Job;
  columns: Column[];
}
export default function JobTile({ job }: JobTileProps) {
  return (
    <div className="mb-2 mx-3 min-w-0">
      <Card className="p-3 rounded-xl shadow-sm min-w-0">
        <p className="text-sm font-medium text-muted-foreground">
          {job.company}
        </p>

        <h3 className="text-sm font-semibold mt-0.5 break-words">
          {job.position}
        </h3>

        {(job.jobType || job.jobMode) && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {job.jobType && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                {job.jobType}
              </span>
            )}
            {job.jobMode && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {job.jobMode}
              </span>
            )}
          </div>
        )}

        <div className="my-3 border-t" />

        {job.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">{job.location}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
