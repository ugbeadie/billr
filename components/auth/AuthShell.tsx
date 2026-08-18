"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import Wordmark from "@/components/landing/Wordmark";
import MockColumn from "@/components/landing/MockColumn";
import { BOARD_BY_STATUS } from "@/components/landing/data";
import { authContainer, authItem } from "./motion";

/**
 * Vertical space is kept tight on purpose so both pages sit on one screen.
 * Padding lives on the column only; the centred block uses my-auto rather
 * than adding its own.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
        <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
          <Link
            href="/"
            aria-label="Trackr home"
            className="w-fit shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
          >
            <Wordmark />
          </Link>

          <motion.div
            variants={authContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto my-auto w-full max-w-sm py-8"
          >
            <motion.h1
              variants={authItem}
              className="text-2xl font-semibold tracking-[-0.02em] text-[#111827]"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={authItem}
              className="mt-2 text-sm leading-relaxed text-[#6B7280]"
            >
              {subtitle}
            </motion.p>

            {children}
          </motion.div>
        </div>

        <aside
          aria-hidden
          className="relative hidden overflow-hidden bg-[#E7F6FF] lg:flex lg:flex-col lg:justify-center"
        >
          <div className="px-12 xl:px-16">
            <p className="max-w-sm text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-[#111827]">
              Everything you applied to, on one board.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4B5563]">
              Paste a job link and Trackr fills in the company, role, salary
              and location for you.
            </p>
          </div>

          {/* Bleeds off the bottom edge on purpose */}
          <div className="mt-10 flex gap-4 pl-12 xl:pl-16">
            <MockColumn
              status="interviewing"
              jobs={BOARD_BY_STATUS.interviewing}
              height="h-[420px]"
              showAdd={false}
              className="-mb-24 shrink-0"
            />
            <MockColumn
              status="offer"
              jobs={BOARD_BY_STATUS.offer}
              height="h-[420px]"
              showAdd={false}
              className="-mb-24 shrink-0"
            />
          </div>
        </aside>
      </div>
    </MotionConfig>
  );
}
