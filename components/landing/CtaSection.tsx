"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MockColumn from "./MockColumn";
import { revealProps } from "./motion";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#E7F6FF]">
      <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-24">
        <motion.div {...revealProps} className="min-w-0 lg:col-span-7">
          <h2 className="max-w-xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Start with the job you applied to yesterday.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#4B5563]">
            Add one application and see whether the board beats your
            spreadsheet. Paste the link and the rest fills itself.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/register"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#3A9AFF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2 sm:w-auto"
            >
              Start tracking
            </Link>
            <p className="text-sm text-[#6B7280]">Free, and no card.</p>
          </div>
        </motion.div>

        {/* Day one. Nothing in it yet, which is the point. */}
        <div aria-hidden className="hidden lg:col-span-5 lg:flex lg:justify-end">
          <MockColumn
            status="applied"
            jobs={[]}
            count={0}
            empty
            height="h-[260px]"
            className="shadow-md shadow-[#3A9AFF]/10"
          />
        </div>
      </div>
    </section>
  );
}
