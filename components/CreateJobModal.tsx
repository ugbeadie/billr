"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateJobModalProps {
  columnId: string;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateJobModal({
  columnId,
  boardId,
  open,
  onOpenChange,
}: CreateJobModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create a new Job
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <Label>Company Name*</Label>
            <Input placeholder="Company Name" />
          </div>

          <div>
            <Label>Position*</Label>
            <Input placeholder="Position" />
          </div>

          <div>
            <Label>Status</Label>
            <Select defaultValue="applied">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="rejected">Ghosted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Salary</Label>
            <Input placeholder="Salary" />
          </div>

          <div>
            <Label>Job type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Location</Label>
            <Input placeholder="Location" />
          </div>

          <div>
            <Label>URL</Label>
            <Input placeholder="https://example.com" />
          </div>

          <div>
            <Label>Applied on</Label>
            <Input type="date" />
          </div>

          <div>
            <Label>Deadline</Label>
            <Input type="date" />
          </div>
        </div>

        <div className="mt-6">
          <Label>Description</Label>
          <Textarea className="min-h-[140px]" />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            className="bg-primary text-white rounded-xl px-6"
            onClick={() => onOpenChange(false)}
          >
            Save & Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
