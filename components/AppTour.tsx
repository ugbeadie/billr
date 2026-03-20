"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import confetti from "canvas-confetti";
import { deleteDemoJobs, createDemoJob } from "@/server/actions";

export default function AppTour({ userId }: { userId: string }) {
  useEffect(() => {
    const key = `tourCompleted-${userId}`;
    const completed = localStorage.getItem(key);

    if (!completed) {
      setTimeout(() => startTour(), 800);
    }
  }, []);

  async function waitForElement(selector: string) {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (document.querySelector(selector)) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  async function startTour() {
    await createDemoJob();
    await waitForElement(".job-tile");

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
            onNextClick: async () => {
              const btn = document.querySelector(
                "#add-job-btn",
              ) as HTMLButtonElement;
              btn?.click();
              await waitForElement("#paste-url");
              driverObj.moveNext();
            },
          },
        },

        {
          element: "#paste-url",
          popover: {
            title: "Paste Job URL",
            description:
              "We will extract essential info from the URL to populate your form.",
            onNextClick: async () => {
              const closeBtn = document.querySelector(
                "#close-modal",
              ) as HTMLButtonElement;
              closeBtn?.click();
              await waitForElement("#kanban-board");
              driverObj.moveNext();
            },
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
          element: "#kanban-board",
          popover: {
            title: "Select Multiple Jobs",
            description:
              "You can select multiple jobs to drag or delete them in bulk.",
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
        localStorage.setItem(`tourCompleted-${userId}`, "true");

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
