"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import confetti from "canvas-confetti";
import { deleteDemoJobs, createDemoJob } from "@/server/actions";

export default function AppTour() {
  useEffect(() => {
    const completed = localStorage.getItem("tourCompleted");
    if (!completed) startTour();
  }, []);

  async function waitForJobTile() {
    return new Promise<void>((resolve) => {
      const check = () => {
        const job = document.querySelector(".job-tile");
        if (job) resolve();
        else setTimeout(check, 200);
      };
      check();
    });
  }

  async function startTour() {
    await createDemoJob();
    await waitForJobTile();

    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",

      steps: [
        {
          element: "#add-job-btn",
          popover: {
            title: "Add Job",
            description: "Click here to add a new job application.",
          },
        },
        {
          element: ".tour-add-column",
          popover: {
            title: "Add Job to Column",
            description:
              "You can also add a job directly to a specific column here.",
          },
        },
        {
          element: "#kanban-board",
          popover: {
            title: "Kanban Board",
            description: "This is where you manage your job applications.",
          },
        },
        {
          element: ".job-tile",
          popover: {
            title: "Drag Jobs",
            description:
              "Drag and drop jobs between columns as your application progresses.",
          },
        },
        {
          // NEW STEP: multi-select and bulk actions
          element: "#kanban-board",
          popover: {
            title: "Select Multiple Jobs",
            description:
              "You can select multiple jobs at once to drag them together or delete them in bulk.",
          },
        },
        {
          element: ".job-tile",
          popover: {
            title: "Job Details",
            description: "Click a job card to open and edit its details.",
          },
        },
        {
          element: "#view-toggle",
          popover: {
            title: "Switch Views",
            description: "Switch between Kanban and List view.",
          },
        },
      ],

      onDestroyed: async () => {
        localStorage.setItem("tourCompleted", "true");

        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        await deleteDemoJobs();
      },
    });

    driverObj.drive();
  }

  return null;
}
