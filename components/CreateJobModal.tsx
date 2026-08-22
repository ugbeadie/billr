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
  X,
  Loader,
} from "lucide-react";

import { useState, useEffect } from "react";
import { createJob, extractJobFromUrl } from "@/server/actions";

import { toast } from "sonner";
import type { Column } from "@/lib/types";
import { motion } from "framer-motion";

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
  const [extracting, setExtracting] = useState(false);
  const [jobUrl, setJobUrl] = useState("");

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
    notes: "",
  });

  useEffect(() => {
    if (open) setSelectedColumnId(defaultColumnId);
  }, [open, defaultColumnId]);

  async function autoExtractFromUrl(url: string) {
    if (!url.includes("http")) return;

    setExtracting(true);

    try {
      const data = await extractJobFromUrl(url);

      setFormData((prev) => ({
        ...prev,
        company: data.company || prev.company,
        position: data.position || prev.position,
        salary: data.salary || prev.salary,
        location: data.location || prev.location,
        jobType: data.jobType || prev.jobType,
        jobMode: data.jobMode || prev.jobMode,
        url,
      }));

      toast.success("Job extracted from URL");
    } catch {
      toast.error("URL extraction failed");
    }

    setExtracting(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        notes: formData.notes || undefined,
        appliedDate: new Date(formData.appliedDate),
        boardId,
        columnId: selectedColumnId,
      });

      toast.success("Job added");

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
        notes: "",
      });

      setJobUrl("");

      onOpenChange(false);
    } catch {
      toast.error("Failed to add job");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="max-h-[95vh] overflow-y-auto p-6"
        >
          <DialogHeader className="flex flex-row justify-between">
            <DialogTitle className="text-2xl font-semibold">
              Add a New Job
            </DialogTitle>

            <button
              id="close-modal"
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <X className="h-4 w-5 text-primary" />
            </button>
          </DialogHeader>

          {/* URL EXTRACTOR */}

          <div className="mt-6 space-y-3">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                id="paste-url"
                className="pl-9"
                placeholder="Paste job URL (LinkedIn, Greenhouse, Lever...)"
                value={jobUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setJobUrl(v);
                  autoExtractFromUrl(v);
                }}
              />
            </div>

            {extracting && (
              <div className="flex items-center gap-2 text-primary text-sm text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" />
                Extracting job details...
              </div>
            )}
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company Name */}
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

                  <SelectContent className="bg-white">
                    {columns
                      .slice()
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
                  onValueChange={(v) =>
                    setFormData({ ...formData, jobType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>

                  <SelectContent className="bg-white">
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

              {/* Job URL */}
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

              {/* Job Mode */}
              <div>
                <Label>Job Mode</Label>

                <Select
                  value={formData.jobMode}
                  onValueChange={(v) =>
                    setFormData({ ...formData, jobMode: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job mode" />
                  </SelectTrigger>

                  <SelectContent className="bg-white">
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

            {/* Notes - the user's own writing. An imported job posting goes
                to `description`, which the extension fills in. */}
            <div className="mt-6">
              <Label>Notes</Label>

              <Textarea
                className="min-h-[140px]"
                placeholder="Add notes about the role, interview feedback, recruiter contact, next steps, etc..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-8">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button type="submit" disabled={loading} className="text-white">
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
