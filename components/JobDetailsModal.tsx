"use client";

import { Column, Job } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { deleteJob, updateJob } from "@/server/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  columnColor?: string;
  columns: Column[];
}

export default function JobDetailsModal({
  job,
  open,
  onClose,
  columnColor,
  columns,
}: JobDetailsModalProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Job | null>(null);

  useEffect(() => {
    setFormData(job ? { ...job } : null);
    setIsEditing(false);
  }, [job]);

  function getColorValue(twColor?: string) {
    const map: Record<string, string> = {
      "bg-blue-500": "#3b82f6",
      "bg-yellow-500": "#eab308",
      "bg-purple-500": "#a855f7",
      "bg-green-500": "#22c55e",
      "bg-red-500": "#ef4444",
      "bg-gray-500": "#6b7280",
    };
    return twColor ? (map[twColor] ?? "#f97316") : "#f97316";
  }

  if (!job || !formData) return null;

  const accent = getColorValue(columnColor);
  const status =
    columns.find((col) => col.id === job.columnId)?.name || "Unknown";

  async function handleDelete() {
    try {
      await deleteJob(job!.id);
      toast.success("Job deleted");
      onClose();
      router.refresh();
    } catch {
      toast.error("Failed to delete job");
    }
  }

  async function handleSave() {
    if (!formData) return;
    try {
      await updateJob(job!.id, {
        company: formData.company,
        position: formData.position,
        salary: formData.salary ?? null,
        location: formData.location ?? null,
        jobType: formData.jobType ?? null,
        url: formData.url ?? null,
        jobMode: formData.jobMode ?? null,
        description: formData.description ?? null,
        appliedDate: formData.appliedDate ?? null,
        columnId: formData.columnId, // updated column
      });

      toast.success("Job updated");
      setIsEditing(false);
      onClose();
      router.refresh();
    } catch {
      toast.error("Failed to update job");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-[95vw] p-0 rounded-2xl overflow-hidden bg-[#f5f5f5]"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="p-3 md:px-6 md:pb-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">
              {isEditing ? "Edit Job Details" : "Job Details"}
            </DialogTitle>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-sm rounded-md bg-green-600 text-white shadow"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setFormData({ ...job });
                      setIsEditing(false);
                    }}
                    className="px-4 py-1.5 text-sm rounded-md bg-gray-400 text-white shadow"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-1.5 text-sm rounded-md bg-red-500 text-white shadow"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 text-sm rounded-md text-white shadow"
                    style={{ backgroundColor: accent }}
                  >
                    <Pencil className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="border-t my-3" />

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-8 md:w-48 w-full">
              <div className="flex flex-col items-center text-center">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                  style={{ backgroundColor: accent }}
                >
                  {formData.company?.charAt(0).toUpperCase()}
                </div>

                {isEditing ? (
                  <input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="mt-2 border rounded-md px-2 py-1 text-sm w-full"
                  />
                ) : (
                  <p className="mt-2 font-medium">{job.company}</p>
                )}

                {/* status */}
                {isEditing ? (
                  <select
                    value={formData.columnId}
                    onChange={(e) =>
                      setFormData({ ...formData, columnId: e.target.value })
                    }
                    className="mt-2 border rounded-md px-2 py-1 text-sm w-full"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className="mt-2 text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {status}
                  </span>
                )}

                {isEditing ? (
                  <input
                    value={formData.url ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="Job URL"
                    className="mt-4 border rounded-md px-2 py-1 text-sm w-full"
                  />
                ) : job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm border px-3 py-1.5 rounded-md w-full sm:w-auto"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Job Post
                  </a>
                ) : (
                  <p className="text-sm mt-8">No job URL available</p>
                )}
              </div>

              <div
                className="bg-white border rounded-lg p-5 text-center"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <p className="text-sm font-medium text-gray-600">Applied On</p>

                {isEditing ? (
                  <input
                    type="date"
                    value={
                      formData.appliedDate
                        ? new Date(formData.appliedDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appliedDate: e.target.value,
                      })
                    }
                    className="mt-2 border rounded-md px-2 py-1 text-sm"
                  />
                ) : job.appliedDate ? (
                  <p className="mt-1 text-sm">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">Not specified</p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 flex flex-col gap-6 md:gap-2">
              {isEditing ? (
                <input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="border rounded-md px-3 py-1 text-sm w-full"
                />
              ) : (
                <h2 className="text-md">{job.position}</h2>
              )}

              <div
                className="bg-white border rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-8"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                {isEditing ? (
                  <>
                    <input
                      placeholder="Location"
                      value={formData.location ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    />
                    <input
                      placeholder="Salary"
                      value={formData.salary ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    />
                    <select
                      value={formData.jobType ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobType: e.target.value || null,
                        })
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                    <select
                      value={formData.jobMode ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobMode: e.target.value || null,
                        })
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value="">Select mode</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on-site">On-site</option>
                    </select>
                  </>
                ) : (
                  <>
                    <DetailItem label="Location" value={job.location} />
                    <DetailItem label="Salary" value={job.salary} />
                    <DetailItem label="Job Type" value={job.jobType} />
                    <DetailItem label="Job Mode" value={job.jobMode} />
                  </>
                )}
              </div>

              <div
                className="bg-white border rounded-lg p-5"
                style={{ borderLeft: `2px solid ${accent}` }}
              >
                <p className="font-medium mb-2">Notes</p>

                {isEditing ? (
                  <textarea
                    value={formData.description ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm">
                    {job.description ||
                      "No notes added for this job application."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-sm mt-1">{value || "Not specified"}</p>
    </div>
  );
}
