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
import {
  Building2,
  Briefcase,
  DollarSign,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createJob } from "@/server/actions";
import { toast } from "sonner";
import type { Column } from "@/lib/types";

interface CreateJobModalProps {
  columns: Column[];
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumnId?: string;
}

export default function CreateJobModal({
  columns,
  boardId,
  open,
  onOpenChange,
  defaultColumnId = "",
}: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedColumnId, setSelectedColumnId] =
    useState<string>(defaultColumnId);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    salary: "",
    location: "",
    jobType: "",
    url: "",
    jobMode: "",
    appliedDate: today,
    description: "",
  });

  useEffect(() => {
    if (open) {
      setSelectedColumnId(defaultColumnId);
    }
  }, [open, defaultColumnId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!selectedColumnId) {
      toast.error("Please select a column");
      return;
    }

    try {
      setLoading(true);

      await createJob({
        company: formData.company,
        position: formData.position,
        salary: formData.salary || undefined,
        location: formData.location || undefined,
        jobType: formData.jobType || undefined,
        url: formData.url || undefined,
        jobMode: formData.jobMode || undefined,
        description: formData.description || undefined,
        appliedDate: new Date(formData.appliedDate),
        boardId,
        columnId: selectedColumnId,
      });

      toast.success("Job added successfully");

      onOpenChange(false);

      const today = new Date().toISOString().split("T")[0];

      setFormData({
        company: "",
        position: "",
        salary: "",
        location: "",
        jobType: "",
        url: "",
        jobMode: "",
        appliedDate: today,
        description: "",
      });

      setSelectedColumnId("");
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full rounded-2xl p-0">
        <div className="max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Add a New Job
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company */}
              <div>
                <Label>Company Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. Google, Stripe, Flutterwave"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <Label>Position *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. Frontend Developer, Product Designer"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Column */}
              <div>
                <Label>Column *</Label>
                <Select
                  value={selectedColumnId}
                  onValueChange={setSelectedColumnId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-[100]">
                    {columns
                      .sort((a, b) => a.order - b.order)
                      .map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Salary */}
              <div>
                <Label>Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. $70,000 - $90,000 / ₦15M annually"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <Label>Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-[100]">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. Remote, Lagos, London"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* URL */}
              <div>
                <Label>Job URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="https://company.com/careers/job-id"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* JOB MODE  */}
              <div>
                <Label>Job Mode</Label>
                <Select
                  value={formData.jobMode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobMode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-[100]">
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applied Date */}
              <div>
                <Label>Applied On</Label>
                <Input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appliedDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <Label>Description / Notes</Label>
              <Textarea
                className="min-h-[140px]"
                placeholder="Add notes about the role, interview feedback, recruiter contact, next steps, etc..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-8">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="rounded-xl px-6"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-xl px-6"
              >
                {loading ? "Saving..." : "Save & Close"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
