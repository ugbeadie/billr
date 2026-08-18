"use client";

import { motion } from "framer-motion";
import MockColumn from "./MockColumn";
import { BOARD } from "./data";
import { revealProps } from "./motion";

/** Overflow cases are deliberate: twelve cards, one card, long names, no salary. */
export default function BoardSection() {
  return (
    <section id="board" className="scroll-mt-16 bg-white py-20 lg:py-28">
      <motion.div
        {...revealProps}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-4xl">
          Where everything lives after that.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6B7280]">
          Six columns, drag between them. A column holds one application or
          twelve, and the card keeps whatever the posting actually gave you.
        </p>
      </motion.div>

      <motion.div
        {...revealProps}
        className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin] lg:mt-12"
      >
        <div className="mx-auto flex w-max snap-x snap-mandatory gap-4 px-4 sm:px-6 lg:snap-none lg:px-8">
          {BOARD.map(({ status, jobs }) => (
            <MockColumn
              key={status}
              status={status}
              jobs={jobs}
              height="h-[520px]"
              className="snap-center"
            />
          ))}
        </div>
      </motion.div>

      <p className="mx-auto mt-2 max-w-7xl px-4 text-sm text-[#9CA3AF] sm:px-6 lg:px-8">
        Scroll sideways — Wishlist and Ghosted are there too.
      </p>
    </section>
  );
}
