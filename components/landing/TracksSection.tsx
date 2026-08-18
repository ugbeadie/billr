"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { revealProps, useMotionOK } from "./motion";
import {
  ACTIVITY_MONTHS,
  ACTIVITY_TOTAL,
  ACTIVITY_WEEKS,
  AGENDA,
  NOTE,
  REST,
  STATUS,
  STATUS_BREAKDOWN,
  STREAKS,
  activityColor,
} from "./data";

export default function TracksSection() {
  return (
    <section className="overflow-x-clip bg-[#F9FAFB] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto min-w-0 max-w-7xl">
        <motion.h2
          {...revealProps}
          className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#111827] sm:text-4xl"
        >
          What it remembers so you don&apos;t have to.
        </motion.h2>

        <motion.div
          {...revealProps}
          className="mt-10 grid min-w-0 gap-5 lg:mt-12 lg:grid-cols-12"
        >
          <ActivityTile className="lg:col-span-8" />

          <div className="grid min-w-0 gap-5 lg:col-span-4">
            <StatusTile />
            <AgendaTile />
          </div>

          <NotesTile className="lg:col-span-7" />
          <RestTile className="lg:col-span-5" />
        </motion.div>
      </div>
    </section>
  );
}

function Tile({
  title,
  hint,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    // min-w-0: grid items default to min-width:auto, so without this a wide
    // child (the 845px heatmap) can force the whole column past the viewport.
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      {hint && <p className="mt-1 text-sm text-[#6B7280]">{hint}</p>}
      <div className={cn("mt-5 min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

const CELL = 13;
const GAP = 3;

/** Computed once at module scope — STATUS_BREAKDOWN never changes. */
const DONUT_R = 52;
const DONUT_C = 2 * Math.PI * DONUT_R;
const DONUT_TOTAL = STATUS_BREAKDOWN.reduce((sum, s) => sum + s.value, 0);
const DONUT_PAD = (3 / 360) * DONUT_C; // matches paddingAngle in StatusChart

const DONUT_SEGMENTS = (() => {
  let offset = 0;
  return STATUS_BREAKDOWN.map(({ key, value }) => {
    const arc = (value / DONUT_TOTAL) * DONUT_C;
    const len = Math.max(arc - DONUT_PAD, 1);
    const segment = {
      key,
      value,
      hex: STATUS[key].hex,
      label: STATUS[key].label,
      dash: `${len} ${DONUT_C - len}`,
      offset,
    };
    offset -= arc;
    return segment;
  });
})();

function ActivityTile({ className }: { className?: string }) {
  const motionOK = useMotionOK();
  const width = ACTIVITY_WEEKS.length * (CELL + GAP) - GAP;

  return (
    <Tile
      title="Applications over time"
      hint={`${ACTIVITY_TOTAL} applications sent in 2026. The gaps say as much as the runs.`}
      className={className}
    >
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="min-w-[150px] rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
            <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden />
            Current streak
          </p>
          <p className="mt-1.5 text-2xl font-semibold text-orange-600">
            {STREAKS.current} days
          </p>
        </div>

        <div className="min-w-[150px] rounded-2xl border border-[#3A9AFF]/30 bg-[#E7F6FF] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3A9AFF]">
            Max streak
          </p>
          <p className="mt-1.5 text-2xl font-semibold text-[#3A9AFF]">
            {STREAKS.longest} days
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto pb-2">
        <div className="relative shrink-0" style={{ width }}>
          <div className="relative mb-2 h-4 text-xs font-medium text-[#9CA3AF]">
            {ACTIVITY_MONTHS.map((m) => (
              <span
                key={m.label}
                className="absolute top-0"
                style={{ left: m.week * (CELL + GAP) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            {ACTIVITY_WEEKS.map((week, w) => (
              <div key={w} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((count, d) => (
                  <div
                    key={d}
                    className="rounded-[3px]"
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: activityColor(count),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/*
            One element rather than 371: a soft-edged cover clipped away to the
            right, so the year appears in the order it happened. Clipped rather
            than translated — a transform would push this 845px box out to
            1690px and double the scroll width of the container it sits in.
          */}
          {motionOK && (
            <motion.div
              aria-hidden
              initial={{ clipPath: "inset(0 0 0 0%)" }}
              whileInView={{ clipPath: "inset(0 0 0 100%)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent,#ffffff_28px)]"
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-[#9CA3AF]">
        Less
        <span className="flex" style={{ gap: GAP }}>
          {[0, 1, 3, 5, 7].map((c) => (
            <span
              key={c}
              className="rounded-[3px]"
              style={{
                width: CELL,
                height: CELL,
                backgroundColor: activityColor(c),
              }}
            />
          ))}
        </span>
        More
      </div>
    </Tile>
  );
}

function StatusTile() {
  return (
    <Tile
      title="Status breakdown"
      hint={`Where the ${DONUT_TOTAL} on your board sit today.`}
    >
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 130 130" className="h-[118px] w-[118px] shrink-0">
          <g transform="rotate(-90 65 65)">
            {DONUT_SEGMENTS.map((s) => (
              <circle
                key={s.key}
                cx="65"
                cy="65"
                r={DONUT_R}
                fill="none"
                stroke={s.hex}
                strokeWidth="16"
                strokeDasharray={s.dash}
                strokeDashoffset={s.offset}
              />
            ))}
          </g>
          <text
            x="65"
            y="61"
            textAnchor="middle"
            className="fill-[#9CA3AF] text-[8px] font-medium tracking-[0.12em]"
          >
            APPLICATIONS
          </text>
          <text
            x="65"
            y="79"
            textAnchor="middle"
            className="fill-[#111827] text-[20px] font-bold"
          >
            {DONUT_TOTAL}
          </text>
        </svg>

        <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
          {DONUT_SEGMENTS.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: s.hex }}
                />
                <span className="truncate text-[#111827]">{s.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-[#6B7280]">
                {s.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Tile>
  );
}

function AgendaTile() {
  return (
    <Tile
      title="Interviews and follow-ups"
      hint="Dated, so Thursday does not arrive as a surprise."
    >
      <ul className="space-y-3">
        {AGENDA.map((row) => (
          <li key={row.date} className="flex gap-3">
            <span className="w-[62px] shrink-0 text-sm tabular-nums text-[#6B7280]">
              <span className="block text-xs text-[#9CA3AF]">{row.day}</span>
              {row.date}
            </span>
            <span className="min-w-0 flex-1 border-l border-[#E5E7EB] pl-3">
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      row.kind === "interview"
                        ? STATUS.interviewing.hex
                        : "#3A9AFF",
                  }}
                />
                <span className="truncate text-sm font-medium text-[#111827]">
                  {row.company}
                </span>
              </span>
              <span className="mt-0.5 block text-sm text-[#6B7280]">
                {row.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

function NotesTile({ className }: { className?: string }) {
  return (
    <Tile
      title="Notes per company"
      hint="Who you spoke to, what they said, what is due."
      className={className}
    >
      <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:p-5">
        <p className="text-sm font-semibold break-words text-[#111827]">
          {NOTE.company}
          <span className="font-normal text-[#6B7280]"> · {NOTE.position}</span>
        </p>
        {/* break-words so the recruiter's email can't push the tile wide. */}
        <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-[#4B5563]">
          {NOTE.body}
        </p>
      </div>
    </Tile>
  );
}

function RestTile({ className }: { className?: string }) {
  return (
    <section
      className={cn("flex min-w-0 flex-col justify-center px-1 py-4", className)}
    >
      <h3 className="text-sm font-semibold text-[#111827]">The rest, briefly</h3>
      <ul className="mt-4 space-y-2.5">
        {REST.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-[#6B7280]"
          >
            <span aria-hidden className="select-none text-[#C4C9D2]">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
