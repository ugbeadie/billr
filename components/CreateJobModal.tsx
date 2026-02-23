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

interface CreateJobModalProps {
  columnId: string;
  boardId: string;
  defaultStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateJobModal({
  columnId,
  boardId,
  open,
  defaultStatus,
  onOpenChange,
}: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: defaultStatus,
    salary: "",
    location: "",
    jobType: "",
    url: "",
    appliedDate: "",
    description: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      status: defaultStatus,
    }));
  }, [defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!columnId) {
      console.error("Missing columnId");
      return;
    }

    try {
      await createJob({
        company: formData.company,
        position: formData.position,
        status: formData.status,
        salary: formData.salary || undefined,
        location: formData.location || undefined,
        jobType: formData.jobType || undefined,
        url: formData.url || undefined,
        description: formData.description || undefined,
        boardId,
        columnId,
      });

      onOpenChange(false);

      // (optional) reset form
      setFormData({
        company: "",
        position: "",
        status: defaultStatus,
        salary: "",
        location: "",
        jobType: "",
        url: "",
        appliedDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create job:", error);
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

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select application status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-[100]">
                    <SelectItem value="wishlist">Wishlist</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="ghosted">Ghosted</SelectItem>
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
                className="rounded-xl px-6"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-primary text-white rounded-xl px-6"
              >
                Save & Close
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
