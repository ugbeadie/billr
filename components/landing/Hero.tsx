"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MockColumn from "./MockColumn";
import MockJobCard from "./MockJobCard";
import { BOARD_BY_STATUS, STATUS } from "./data";
import { useMotionOK } from "./motion";

/** Tall enough for exactly three full cards. */
const COLUMN_H = "h-[500px]";

export default function Hero() {
  const motionOK = useMotionOK();

  const applied = BOARD_BY_STATUS.applied;
  const interviewing = BOARD_BY_STATUS.interviewing;
  const offer = BOARD_BY_STATUS.offer;

  const [dropped, ...rest] = interviewing;

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <motion.div
          initial={motionOK ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <h1 className="text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#111827] sm:text-5xl lg:text-[3.4rem]">
            You applied to thirty jobs. Trackr keeps track of all thirty.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Paste a job link and the form fills itself. After that every
            application sits on one board — what stage it is at, what it pays,
            and who you are waiting on.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/register"
              className="inline-flex h-11 items-center rounded-md bg-[#3A9AFF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2"
            >
              Start tracking
            </Link>

            <Link
              href="#board"
              className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
            >
              Look at the board first
              <ArrowDown className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-7">
          <div className="flex justify-center gap-4 lg:w-212 lg:justify-start">
            {/* Four cards in a box that holds three, so the column visibly
                continues past its own edge. */}
            <MockColumn
              status="applied"
              jobs={applied.slice(0, 4)}
              count={applied.length}
              className="hidden sm:flex"
              height={COLUMN_H}
              showAdd={false}
            />

            <MockColumn
              status="interviewing"
              jobs={[]}
              count={interviewing.length}
              height={COLUMN_H}
              showAdd={false}
              liftRoom={motionOK}
            >
              <DroppedCard job={dropped} motionOK={motionOK} />
              {rest.map((job) => (
                <MockJobCard
                  key={job.id}
                  job={job}
                  accent={STATUS.interviewing.hex}
                />
              ))}
            </MockColumn>

            <MockColumn
              status="offer"
              jobs={offer}
              className="hidden md:flex"
              height={COLUMN_H}
              showAdd={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DroppedCard({
  job,
  motionOK,
}: {
  job: (typeof BOARD_BY_STATUS)["interviewing"][number];
  motionOK: boolean;
}) {
  if (!motionOK) {
    return <MockJobCard job={job} accent={STATUS.interviewing.hex} />;
  }

  return (
    <div className="relative z-10">
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.85, duration: 0.3 }}
        className="absolute inset-0 rounded-xl border-2 border-dashed border-[#8B5CF6]/45"
      />
      <motion.div
        initial={{
          y: -20,
          rotate: -1.5,
          boxShadow: "0 20px 32px -14px rgba(17,24,39,0.4)",
        }}
        animate={{
          y: 0,
          rotate: 0,
          boxShadow: "0 1px 2px 0 rgba(17,24,39,0.05)",
        }}
        transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.5 }}
        className="relative rounded-xl"
      >
        <MockJobCard job={job} accent={STATUS.interviewing.hex} />
      </motion.div>
    </div>
  );
}
