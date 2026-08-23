# Trackr 💼

**Smart Job Application Tracking for Modern Job Seekers**

Trackr is a modern SaaS job application tracking platform built to help job seekers organize applications, manage interviews, and land roles faster.

Trackr is live at [trackr.ugbeadie.com](https://trackr.ugbeadie.com) with authentication, a drag-and-drop Kanban board, analytics, AI-powered job extraction, and a Chrome extension that saves postings from job boards and company career pages in one click.

---

## 🚀 Overview

Trackr simplifies job hunting by providing:

- Application tracking
- Interview management
- Status monitoring
- Kanban-style job board
- Progress insights
- Organized company notes
- AI-powered job detail extraction
- One-click saving from job boards and company career pages via the browser extension
- Secure authentication system

The mission is simple:

> Help job seekers stay organized and increase their chances of getting hired.

---

## 🎯 Target Audience

Trackr is built for:

- Students
- Recent graduates
- Career switchers
- Remote job seekers
- Professionals actively job hunting

If you're applying to jobs, Trackr is for you.

---

## ✨ Features

### 📌 Job Application Tracking

- Log every job you apply to
- Track roles by status (Applied, Interviewing, Offer, Rejected)
- Organize applications visually with Kanban boards
- Add notes for each opportunity

### 🤖 AI Job Autofill

Trackr includes an AI-powered job parser that saves time when adding applications.

Users can simply paste a job description or job posting link and Trackr will automatically extract key details such as:

- Company name
- Position
- Salary (if available)
- Location
- Job type (Full-time, Internship, etc.)
- Work mode (Remote, Hybrid, Onsite)

This allows users to add jobs in seconds instead of manually filling every field.

### 📅 Interview Management

- Track interview stages
- Add interview dates & notes
- Stay on top of follow-ups

### 📊 Dashboard Overview

- Visual overview of application progress
- Monitor success rates
- Track application volume
- Status breakdown insights
- GitHub-style activity graph showing job search activity over time

### 🔐 Authentication (Core Feature)

Trackr includes a secure authentication system to ensure:

- User account creation (Register)
- Secure login & logout
- Protected dashboard routes
- Session management

Authentication will allow each user to:

- Access their own jobs
- Manage their own applications
- Track personal interview progress
- Securely store job search data

---

## 🧩 Browser Extension

Save a job straight from a posting — no copy-and-paste. The extension reads the
role, company, location, salary, job type and description from the page and
files it on your board in one click.

Works across job boards and company career pages, not just the big three.

Most sites publish `JobPosting` structured data, and the extension reads it
directly — that covers Greenhouse, Lever, Workable, Ashby, SmartRecruiters,
Workday and the majority of company-hosted careers pages. Where a site doesn't,
it falls back to Open Graph tags and page heuristics. **LinkedIn**, **Indeed**
and **Glassdoor** additionally have hand-tuned extraction, since their markup
needs special handling.

### Try it (about 2 minutes, no Chrome developer account needed)

1. **Create an account** at [trackr.ugbeadie.com](https://trackr.ugbeadie.com).
   Your board is set up automatically with WishList, Applied, Interviewing,
   Offer, Rejected and Ghosted columns.

2. **Download this project.** On the
   [repository page](https://github.com/ugbeadie/billr), click the green
   **Code** button, then **Download ZIP**. Unzip it — you'll get a folder
   named something like `billr-main`.

   Prefer the terminal? `git clone https://github.com/ugbeadie/billr.git`

3. **Open Chrome's extensions page.** Go to `chrome://extensions`, and switch
   on **Developer mode** using the toggle in the top-right corner.

4. **Click "Load unpacked"** (top-left, appears once Developer mode is on) and
   select the folder named **`extension`** that sits inside the project folder
   you just unzipped — so `billr-main/extension`.

   > Pick the `extension` folder itself. Don't select the project folder, and
   > don't open `extension` and select the files inside it.

5. **Pin it.** Chrome tucks new extensions behind the puzzle-piece icon in the
   toolbar — click it, find **Trackr**, and hit the pin so the icon stays
   visible.

6. **Open a job posting** — any job board or company careers page.

7. **Click the Trackr icon.** You'll see the role and company, and a
   **Save to Applied** button.

8. **Save it**, or click the pencil to edit the column, salary, job type, work
   mode and description first.

9. **Check your board** — the external-link icon in the extension header opens
   your dashboard, where the job is waiting in the column you chose.

### Notes

- You must be signed in at trackr.ugbeadie.com first; the extension uses your
  existing session. If you aren't, the popup offers a sign-in button.
- No page refresh is needed after installing — the extension injects its reader
  on demand, so tabs you already had open still work.
- On a page it can't read (a new tab, `chrome://` pages), the popup says so and
  offers a blank form to fill in by hand.
- The gear icon sets which column new jobs default to.

---

## 🧠 How It Works

1. Create your account
2. Add a job application or paste a job link for AI autofill
3. Move it through stages
4. Track interview and progress
5. Analyze your job search through analytics

---

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

### Backend

- Next.js API Routes
- Database (PostgreSQL)
- ORM (Drizzle)
- Authentication (Better-Auth)
- Cloud Storage (for PDFs)
