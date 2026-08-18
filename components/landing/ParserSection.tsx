"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  DollarSign,
  Link as LinkIcon,
  Loader,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionOK, revealProps } from "./motion";
import { PARSER_FIELDS, PARSER_SOURCE, PARSER_TIMELINE, PARSER_URL } from "./data";

const FIELD_ICONS = {
  building: Building2,
  briefcase: Briefcase,
  money: DollarSign,
  pin: MapPin,
  select: ChevronDown,
} as const;

/**
 * The centrepiece.
 *
 * Left: the posting as it exists on the web, on the dark stage. Right: Trackr,
 * on white. Six fields fill in sequence, and as each one lands the fragment it
 * came from lights up on the left with a matching number. The numbers run out
 * of order in the source on purpose — that scattering is what the parser undoes.
 */
export default function ParserSection() {
  const motionOK = useMotionOK();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const [pasted, setPasted] = useState(false);
  const [reading, setReading] = useState(false);
  const [filled, setFilled] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = null;
  }, []);

  /** Schedules the run. Sets no state synchronously, so it is safe in an effect. */
  const start = useCallback(() => {
    clear();

    const t0 = performance.now();
    ticker.current = setInterval(() => {
      setElapsed(Math.min(performance.now() - t0, PARSER_TIMELINE.done));
    }, 50);

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    at(PARSER_TIMELINE.paste, () => setPasted(true));
    at(PARSER_TIMELINE.readStart, () => setReading(true));
    PARSER_TIMELINE.fields.forEach((ms, i) => at(ms, () => setFilled(i + 1)));
    at(PARSER_TIMELINE.done, () => {
      setReading(false);
      setComplete(true);
      setElapsed(PARSER_TIMELINE.done);
      if (ticker.current) clearInterval(ticker.current);
      ticker.current = null;
    });
  }, [clear]);

  /** Replay is an event handler, so it can reset straight away. */
  const replay = useCallback(() => {
    clear();
    setPasted(false);
    setReading(false);
    setFilled(0);
    setElapsed(0);
    setComplete(false);
    start();
  }, [clear, start]);

  useEffect(() => {
    if (!inView || !motionOK) return;
    start();
    return clear;
  }, [inView, motionOK, start, clear]);

  /*
   * With reduced motion there is no run at all — the panels are rendered in
   * their finished state, so nothing animates and nothing needs unwinding.
   */
  const done = PARSER_FIELDS.length;
  const showPasted = motionOK ? pasted : true;
  const showReading = motionOK ? reading : false;
  const showFilled = motionOK ? filled : done;
  const showComplete = motionOK ? complete : true;
  const seconds = ((motionOK ? elapsed : PARSER_TIMELINE.done) / 1000).toFixed(
    1,
  );

  return (
    <section
      id="parser"
      ref={ref}
      className="scroll-mt-16 bg-[#111827] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div {...revealProps} className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#3A9AFF]">
            Adding a job
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
            Paste the link. The form fills itself.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
            Trackr reads the posting and writes down the six things you would
            otherwise copy across by hand.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          <SourcePanel filled={showFilled} />
          <FormPanel
            pasted={showPasted}
            reading={showReading}
            filled={showFilled}
            complete={showComplete}
          />
        </div>

        {/* Clock and controls */}
        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Elapsed
              </p>
              <p className="mt-1.5 text-3xl font-semibold tabular-nums text-white">
                {seconds}s
              </p>
            </div>
            <p className="pb-1.5 max-w-xs text-sm leading-snug text-white/45">
              Copying it across by hand takes about two minutes.
            </p>
          </div>

          {/* Hidden in CSS rather than JS: nothing to animate under reduced
              motion, and a JS gate would pop in after hydration. */}
          <button
            type="button"
            onClick={replay}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/60 motion-reduce:hidden"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Replay
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SourcePanel({ filled }: { filled: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <p className="min-w-0 flex-1 truncate rounded bg-white/5 px-2.5 py-1 text-xs text-white/40">
          {PARSER_URL}
        </p>
      </div>

      <p className="whitespace-pre-wrap px-5 py-5 font-normal leading-[1.85] text-white/45 text-[13px] sm:px-6 sm:py-6 sm:text-sm">
        {PARSER_SOURCE.map((run, i) => {
          if (run.field === undefined) return <span key={i}>{run.text}</span>;
          const found = run.field < filled;
          return (
            <span
              key={i}
              className={cn(
                "rounded px-1 py-0.5 transition-colors duration-300",
                found ? "bg-[#3A9AFF]/20 text-white" : "text-white/45",
              )}
            >
              {run.text}
              {found && <Tag n={run.field + 1} />}
            </span>
          );
        })}
      </p>
    </div>
  );
}

/** The number that ties a fragment on the left to a field on the right. */
function Tag({ n }: { n: number }) {
  return (
    <span
      className="ml-1 inline-flex h-4 w-4 -translate-y-px items-center justify-center rounded-full bg-[#3A9AFF] align-middle text-[10px] font-semibold tabular-nums text-white"
      aria-hidden
    >
      {n}
    </span>
  );
}

/* ------------------------------------------------------------------ */

function FormPanel({
  pasted,
  reading,
  filled,
  complete,
}: {
  pasted: boolean;
  reading: boolean;
  filled: number;
  complete: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
        <h3 className="text-lg font-semibold text-[#111827]">Add a New Job</h3>
        <span className="text-xs text-[#6B7280]">Trackr</span>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {/* The paste field */}
        <div className="relative">
          <LinkIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
            aria-hidden
          />
          <div
            className={cn(
              "flex h-10 items-center rounded-md border pl-9 pr-3 text-sm transition-colors duration-200",
              pasted
                ? "border-[#3A9AFF] bg-white text-[#111827]"
                : "border-[#E5E7EB] bg-white text-[#9CA3AF]",
            )}
          >
            <span className="truncate">
              {pasted
                ? PARSER_URL
                : "Paste job URL (LinkedIn, Greenhouse, Lever...)"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex h-5 items-center gap-2 text-sm">
          {reading && (
            <span className="flex items-center gap-2 text-[#6B7280]">
              <Loader className="h-4 w-4 animate-spin" aria-hidden />
              Extracting job details...
            </span>
          )}
          {complete && (
            <span className="flex items-center gap-2 font-medium text-[#3A9AFF]">
              <Check className="h-4 w-4" aria-hidden />
              Job extracted from URL
            </span>
          )}
        </div>

        {/* The six fields */}
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          {PARSER_FIELDS.map((field, i) => {
            const Icon = FIELD_ICONS[field.icon];
            const isFilled = i < filled;
            const isSelect = field.icon === "select";

            return (
              <div key={field.label}>
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B7280]">
                  {field.label}
                </label>

                <motion.div
                  animate={
                    isFilled
                      ? { borderColor: "#3A9AFF", backgroundColor: "#E7F6FF" }
                      : { borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" }
                  }
                  transition={{ duration: 0.28 }}
                  className={cn(
                    "relative mt-1.5 flex h-10 items-center rounded-md border pr-8",
                    isSelect ? "pl-3" : "pl-9",
                  )}
                >
                  {/* Selects carry their chevron on the right; inputs an icon on the left. */}
                  <Icon
                    className={cn(
                      "pointer-events-none absolute h-4 w-4 transition-colors",
                      isSelect
                        ? "right-2.5 text-[#9CA3AF]"
                        : isFilled
                          ? "left-3 text-[#3A9AFF]"
                          : "left-3 text-[#9CA3AF]",
                    )}
                    aria-hidden
                  />

                  <span
                    className={cn(
                      "truncate text-sm",
                      isFilled
                        ? "font-medium text-[#111827]"
                        : "text-[#C4C9D2]",
                    )}
                  >
                    {isFilled ? field.value : "—"}
                  </span>

                  {isFilled && (
                    <span
                      className={cn(
                        "absolute",
                        isSelect ? "right-8" : "right-2.5",
                      )}
                    >
                      <Tag n={i + 1} />
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
