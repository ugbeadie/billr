import { Column, Job } from "@/lib/types";
import { Card } from "./ui/card";

interface JobTileProps {
  job: Job;
  columns: Column[];
}
export default function JobTile({ job, columns }: JobTileProps) {
  return (
    <div className="mb-2 mx-3 bg-white rounded-lg shadow-sm border-0">
      <Card className="p-3">{job.position}</Card>
    </div>
  );
}
