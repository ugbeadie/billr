/**
 * Deterministic on purpose — no Date.now(), no Math.random(), and dates
 * pre-formatted rather than run through locale-dependent toLocaleDateString,
 * so server and client render identical markup and hydration stays quiet.
 */

export type MockJob = {
  id: string;
  company: string;
  position: string;
  salary?: string;
  location?: string;
  jobType?: "full-time" | "part-time" | "contract" | "internship";
  jobMode?: "remote" | "hybrid" | "onsite";
  appliedDate?: string;
  url?: string;
};

export type StatusKey =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "ghosted";

export const STATUS: Record<StatusKey, { label: string; hex: string }> = {
  wishlist: { label: "WishList", hex: "#3B82F6" },
  applied: { label: "Applied", hex: "#EAB308" },
  interviewing: { label: "Interviewing", hex: "#8B5CF6" },
  offer: { label: "Offer", hex: "#22C55E" },
  rejected: { label: "Rejected", hex: "#EF4444" },
  ghosted: { label: "Ghosted", hex: "#6B7280" },
};

/* Pill palettes lifted from JobTile.tsx:55-82 so mock cards match real ones. */
export function jobTypeClasses(type?: string) {
  switch (type) {
    case "full-time":
      return "bg-green-100 text-green-700";
    case "part-time":
      return "bg-blue-100 text-blue-700";
    case "contract":
      return "bg-purple-100 text-purple-700";
    case "internship":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function jobModeClasses(mode?: string) {
  switch (mode) {
    case "remote":
      return "bg-indigo-100 text-indigo-700";
    case "hybrid":
      return "bg-yellow-100 text-yellow-800";
    case "onsite":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function jobTypeLabel(type?: string) {
  return type === "full-time"
    ? "Full-time"
    : type === "part-time"
      ? "Part-time"
      : type === "contract"
        ? "Contract"
        : type === "internship"
          ? "Internship"
          : "";
}

export function jobModeLabel(mode?: string) {
  return mode === "remote"
    ? "Remote"
    : mode === "hybrid"
      ? "Hybrid"
      : mode === "onsite"
        ? "On-site"
        : "";
}

export const BOARD: { status: StatusKey; jobs: MockJob[] }[] = [
  {
    status: "wishlist",
    jobs: [
      {
        id: "w1",
        company: "Kuda",
        position: "Product Engineer",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "hybrid",
      },
      {
        id: "w2",
        company: "Andela",
        position: "Full-Stack Engineer",
        salary: "$70,000 – $90,000",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
      },
      {
        id: "w3",
        company: "Paystack",
        position: "Frontend Engineer",
        location: "Lagos, Nigeria",
        jobMode: "hybrid",
      },
      {
        id: "w4",
        company: "Moniepoint",
        position: "Senior React Developer",
        salary: "₦14M annually",
        location: "Remote",
        jobType: "contract",
        jobMode: "remote",
      },
    ],
  },
  {
    status: "applied",
    jobs: [
      {
        id: "a1",
        company: "Interswitch Group Limited",
        position: "Senior Frontend Engineer, Payments Platform",
        salary: "₦16,000,000 – ₦22,000,000",
        location: "Victoria Island, Lagos",
        jobType: "full-time",
        jobMode: "onsite",
        appliedDate: "14 Aug 2026",
        url: "https://example.com/1",
      },
      {
        id: "a2",
        company: "Flutterwave",
        position: "Frontend Engineer",
        salary: "$65,000 – $85,000",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "13 Aug 2026",
        url: "https://example.com/2",
      },
      {
        id: "a3",
        company: "Kuda",
        position: "Full-Stack Engineer",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "12 Aug 2026",
      },
      {
        id: "a4",
        company: "Andela",
        position: "Senior React Developer",
        salary: "$90,000",
        location: "Remote",
        jobType: "contract",
        jobMode: "remote",
        appliedDate: "11 Aug 2026",
        url: "https://example.com/4",
      },
      {
        id: "a5",
        company: "Moniepoint",
        position: "Product Engineer",
        salary: "₦12M – ₦18M",
        location: "Ikeja, Lagos",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "10 Aug 2026",
      },
      {
        id: "a6",
        company: "Paystack",
        position: "Frontend Engineer, Dashboard",
        salary: "₦12,000,000 – ₦18,000,000",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "07 Aug 2026",
        url: "https://example.com/6",
      },
      {
        id: "a7",
        company: "Flutterwave",
        position: "Product Engineer",
        location: "Nairobi, Kenya",
        jobType: "full-time",
        jobMode: "onsite",
        appliedDate: "06 Aug 2026",
      },
      {
        id: "a8",
        company: "Kuda",
        position: "Senior React Developer",
        salary: "£55,000 – £70,000",
        location: "London, UK",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "04 Aug 2026",
        url: "https://example.com/8",
      },
      {
        id: "a9",
        company: "Andela",
        position: "Frontend Engineer",
        location: "Remote",
        jobType: "part-time",
        jobMode: "remote",
        appliedDate: "31 Jul 2026",
      },
      {
        id: "a10",
        company: "Moniepoint",
        position: "Full-Stack Engineer",
        salary: "₦15M annually",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "29 Jul 2026",
        url: "https://example.com/10",
      },
      {
        id: "a11",
        company: "Paystack",
        position: "Product Engineer",
        location: "Lagos, Nigeria",
        jobType: "internship",
        jobMode: "onsite",
        appliedDate: "27 Jul 2026",
      },
      {
        id: "a12",
        company: "Interswitch Group Limited",
        position: "Full-Stack Engineer",
        salary: "₦10M – ₦14M",
        location: "Abuja, Nigeria",
        jobType: "contract",
        jobMode: "hybrid",
        appliedDate: "24 Jul 2026",
        url: "https://example.com/12",
      },
    ],
  },
  {
    status: "interviewing",
    jobs: [
      {
        id: "i1",
        company: "Flutterwave",
        position: "Senior React Developer",
        salary: "$80,000 – $110,000",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "05 Aug 2026",
        url: "https://example.com/i1",
      },
      {
        id: "i2",
        company: "Moniepoint",
        position: "Frontend Engineer",
        salary: "₦13M – ₦19M",
        location: "Ikeja, Lagos",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "30 Jul 2026",
      },
      {
        id: "i3",
        company: "Kuda",
        position: "Product Engineer",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "22 Jul 2026",
        url: "https://example.com/i3",
      },
    ],
  },
  {
    status: "offer",
    jobs: [
      {
        id: "o1",
        company: "Paystack",
        position: "Senior React Developer",
        salary: "₦12,000,000 – ₦18,000,000",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "18 Jul 2026",
        url: "https://example.com/o1",
      },
    ],
  },
  {
    status: "rejected",
    jobs: [
      {
        id: "r1",
        company: "Andela",
        position: "Full-Stack Engineer",
        salary: "$75,000",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "16 Jul 2026",
      },
      {
        id: "r2",
        company: "Flutterwave",
        position: "Frontend Engineer",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "onsite",
        appliedDate: "09 Jul 2026",
        url: "https://example.com/r2",
      },
      {
        id: "r3",
        company: "Kuda",
        position: "Senior React Developer",
        salary: "£60,000",
        location: "London, UK",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "02 Jul 2026",
      },
      {
        id: "r4",
        company: "Interswitch Group Limited",
        position: "Product Engineer",
        location: "Abuja, Nigeria",
        jobType: "contract",
        jobMode: "onsite",
        appliedDate: "25 Jun 2026",
      },
      {
        id: "r5",
        company: "Moniepoint",
        position: "Frontend Engineer",
        salary: "₦11M – ₦15M",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "19 Jun 2026",
        url: "https://example.com/r5",
      },
    ],
  },
  {
    status: "ghosted",
    jobs: [
      {
        id: "g1",
        company: "Andela",
        position: "Product Engineer",
        location: "Remote",
        jobType: "full-time",
        jobMode: "remote",
        appliedDate: "12 Jun 2026",
      },
      {
        id: "g2",
        company: "Paystack",
        position: "Full-Stack Engineer",
        salary: "₦9M – ₦13M",
        location: "Lagos, Nigeria",
        jobType: "full-time",
        jobMode: "hybrid",
        appliedDate: "05 Jun 2026",
      },
      {
        id: "g3",
        company: "Flutterwave",
        position: "Senior React Developer",
        location: "Remote",
        jobMode: "remote",
        appliedDate: "28 May 2026",
      },
    ],
  },
];

export const BOARD_BY_STATUS = Object.fromEntries(
  BOARD.map((c) => [c.status, c.jobs]),
) as Record<StatusKey, MockJob[]>;

export const PARSER_URL =
  "https://paystack.com/careers/senior-react-developer";

/** Form fields, in the order CreateJobModal lays them out. */
export const PARSER_FIELDS = [
  { label: "Company Name", value: "Paystack", icon: "building" },
  { label: "Position", value: "Senior React Developer", icon: "briefcase" },
  { label: "Salary", value: "₦12,000,000 – ₦18,000,000", icon: "money" },
  { label: "Location", value: "Lagos, Nigeria", icon: "pin" },
  { label: "Job Type", value: "Full-time", icon: "select" },
  { label: "Job Mode", value: "Hybrid", icon: "select" },
] as const;

/** `field` ties a run to the form field it fills. Out of order on purpose. */
export const PARSER_SOURCE: { text: string; field?: number }[] = [
  { text: "We're looking for a " },
  { text: "Senior React Developer", field: 1 },
  { text: " to join the Merchant Experience team at " },
  { text: "Paystack", field: 0 },
  { text: ".\n\nYou'll be based in our " },
  { text: "Lagos, Nigeria", field: 3 },
  { text: " office. The team works " },
  { text: "hybrid", field: 5 },
  { text: " — two days a week on site, the rest wherever you like. This is a " },
  { text: "full-time", field: 4 },
  { text: " role.\n\nCompensation is " },
  { text: "₦12,000,000 – ₦18,000,000", field: 2 },
  {
    text: " annually, depending on experience, plus equity.\n\nYou'll own the merchant dashboard end to end, working alongside two other frontend engineers and a designer.",
  },
];

/** Milliseconds from the start of the run. */
export const PARSER_TIMELINE = {
  paste: 180,
  readStart: 320,
  fields: [900, 1140, 1380, 1620, 1860, 2100],
  done: 2400,
};

/** The full year is always drawn: future weeks are empty cells, not holes. */
const WEEKS_ELAPSED = 34;

const WEEK_SHAPE = [
  0, 0, 0, 0, 1, 1, 2, 1, 3, 4, 4, 3, 2, 4, 5, 5, 4, 3, 5, 4, 2, 1, 3, 4, 5, 4,
  2, 1, 3, 4, 5, 3, 4, 2,
];

export const ACTIVITY_WEEKS: number[][] = (() => {
  let seed = 20260818;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  return Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      if (w >= WEEKS_ELAPSED) return 0;
      const weekend = d === 0 || d === 6;
      // Most days you send nothing. On a busy weekday it's one, sometimes two.
      const chance = (WEEK_SHAPE[w] / 5) * 0.28 * (weekend ? 0.3 : 1);
      const applied = next();
      const howMany = next();
      if (applied > chance) return 0;
      return howMany < 0.18 ? 2 : 1;
    }),
  );
})();

export const ACTIVITY_TOTAL = ACTIVITY_WEEKS.flat().reduce((a, b) => a + b, 0);

export const ACTIVITY_MONTHS = [
  { label: "Jan", week: 0 },
  { label: "Feb", week: 5 },
  { label: "Mar", week: 9 },
  { label: "Apr", week: 13 },
  { label: "May", week: 18 },
  { label: "Jun", week: 22 },
  { label: "Jul", week: 26 },
  { label: "Aug", week: 31 },
  { label: "Sep", week: 35 },
  { label: "Oct", week: 40 },
  { label: "Nov", week: 44 },
  { label: "Dec", week: 48 },
];

export const STREAKS = { current: 4, longest: 9 };

/** Ramp from JobActivityHeatmap.tsx:33-39. */
export function activityColor(count: number) {
  if (count === 0) return "#EBEDF0";
  if (count < 2) return "#BFDBFE";
  if (count < 4) return "#93C5FD";
  if (count < 6) return "#60A5FA";
  return "#2563EB";
}

export const STATUS_BREAKDOWN: { key: StatusKey; value: number }[] = [
  { key: "wishlist", value: 4 },
  { key: "applied", value: 12 },
  { key: "interviewing", value: 3 },
  { key: "offer", value: 1 },
  { key: "rejected", value: 5 },
  { key: "ghosted", value: 3 },
];

export const AGENDA = [
  {
    day: "Thu",
    date: "20 Aug",
    company: "Flutterwave",
    detail: "Technical round, 2:00pm",
    kind: "interview" as const,
  },
  {
    day: "Fri",
    date: "21 Aug",
    company: "Paystack",
    detail: "Follow up — no reply in 9 days",
    kind: "followup" as const,
  },
  {
    day: "Mon",
    date: "24 Aug",
    company: "Moniepoint",
    detail: "System design, 10:30am",
    kind: "interview" as const,
  },
  {
    day: "Wed",
    date: "26 Aug",
    company: "Kuda",
    detail: "Chat with the hiring manager",
    kind: "interview" as const,
  },
];

export const NOTE = {
  company: "Moniepoint",
  position: "Frontend Engineer",
  body: `Recruiter is Tolu (tolu@moniepoint.com). Screening call went fine — the team is six engineers and they want someone comfortable owning the design system.

Take-home is a dashboard, four hours, due Friday. Asked about salary: the band is fixed but there's room on level.

Second round is with Chidi, who wrote most of the current frontend. Read the changelog before that one.`,
};

export const REST = [
  "Search by company or position",
  "A list view for when the board is too much",
  "Select several cards and move or delete them at once",
  "Six columns, including Wishlist and Ghosted",
  "A browser extension that saves listings from LinkedIn, Indeed and Glassdoor",
];

export const REPO_URL = "https://github.com/ugbeadie/billr";
