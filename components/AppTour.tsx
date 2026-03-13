"use client";

import Joyride, { Step } from "react-joyride";
import { useState, useEffect } from "react";

const steps: Step[] = [
  {
    target: "#add-job-btn",
    content: "Click here to add a new job application.",
    disableBeacon: true,
  },

  {
    target: "#kanban-board",
    content: "This is where you manage your job applications.",
  },
  {
    target: "#search-jobs",
    content: "Search jobs by company or role.",
  },
  {
    target: "#view-toggle",
    content: "Switch between Kanban and List view here.",
  },
];

export default function AppTour() {
  const [mounted, setMounted] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setMounted(true);

    const completed = localStorage.getItem("tourCompleted");

    if (!completed) {
      // Delay tour start so UI mounts first
      setTimeout(() => {
        setRun(true);
      }, 800);
    }
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: "#7c6bff",
          backgroundColor: "#0a0720",
          textColor: "#fff",
          arrowColor: "#0a0720",
          zIndex: 10000,
        },
      }}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          localStorage.setItem("tourCompleted", "true");
        }
      }}
    />
  );
}
