"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Play } from "lucide-react";
import { useMotionOK, revealProps } from "./motion";

const POINTS = [
  "Reads the role, company, salary, location and work mode — not just the title",
  "Works on LinkedIn, Indeed, Glassdoor and any careers page with standard job data",
  "Correct anything before it saves, or send it straight to Applied",
];

export default function ExtensionSection() {
  const motionOK = useMotionOK();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !motionOK) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.play().then(
          () => setPlaying(true),
          () => {}, // autoplay refused; the play button still works
        );
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [motionOK]);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      el.play().then(
        () => setPlaying(true),
        () => {},
      );
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <section
      id="extension"
      className="scroll-mt-16 bg-[#F9FAFB] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div {...revealProps} className="min-w-0 lg:col-span-5">
          <span className="inline-flex items-center rounded-full bg-[#E7F6FF] px-3 py-1 text-xs font-medium text-[#1D6FCC]">
            Browser extension
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Save a job without leaving the posting.
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-[#4B5563]">
            The typing is the part everyone quits over. Click the icon on any
            job page and Trackr reads the posting, shows you what it found, and
            files it on your board.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <Check
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#3A9AFF]"
                />
                <span className="text-sm leading-relaxed text-[#4B5563]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/register"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#3A9AFF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2 sm:w-auto"
            >
              Start tracking
            </Link>
            <a
              href="https://github.com/ugbeadie/billr#-browser-extension"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#6B7280] underline-offset-4 transition-colors hover:text-[#111827] hover:underline"
            >
              Install the extension
            </a>
          </div>
        </motion.div>

        <motion.div {...revealProps} className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl shadow-black/5">
            {/* <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-4 py-3">
              <div aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
              </div>
              <div className="flex h-6 flex-1 items-center rounded-md bg-[#F3F4F6] px-3 text-[11px] text-[#9CA3AF]">
                linkedin.com/jobs
              </div>
            </div> */}

            <div className="relative bg-[#111827]">
              <video
                ref={videoRef}
                src="/extension-demo.mp4"
                muted
                loop
                playsInline
                preload="none"
                onClick={toggle}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                aria-label="Saving a job from a LinkedIn posting to the Trackr board"
                className="block h-auto w-full cursor-pointer"
              />

              {!playing && (
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg">
                    <Play
                      aria-hidden
                      className="ml-0.5 h-6 w-6 fill-[#111827] text-[#111827]"
                    />
                  </span>
                  <span className="sr-only">Play the demo</span>
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-[#9CA3AF]">
            One click on the posting, and it&rsquo;s on the board.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
