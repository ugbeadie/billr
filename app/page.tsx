"use client";

import {
  CheckCircle2,
  FileText,
  Briefcase,
  Users,
  Download,
  Eye,
  BarChart3,
  ArrowRight,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* NavBar */}
      <nav className="fixed top-0 w-full z-50 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold text-primary"
            >
              <Image
                src="/images/logo.png"
                alt="Trackr logo"
                width={24}
                height={24}
                priority
              />
              TRACKR
            </Link>{" "}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent text-primary border border-primary/30 px-6 py-2 rounded-md font-medium hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Register
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-primary-light">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center pt-8"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-balance leading-tight text-heading">
            Organize Your Job Search. Land Your Next{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-primary">Role Faster</span>
              <svg
                className="absolute left-0 w-full h-8 -bottom-5 text-primary"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M 5 25 Q 50 5 95 25"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto text-text">
            Track job applications, manage interviews, monitor statuses, and
            stay organized throughout your job search journey.
          </p>

          <div className="mt-6 flex justify-center flex-wrap gap-4">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Start Tracking Free
              </motion.button>
            </Link>

            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary border border-border px-6 py-2 rounded-md font-medium hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Learn more
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              Everything You Need to Manage Applications
            </h2>
            <p className="text-lg text-text">
              Stay in control of your job search
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: "Track Applications",
                description:
                  "Log every job you apply to and monitor its status in one place.",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Manage Interviews",
                description:
                  "Keep track of interview dates, times, and follow-ups.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Visual Dashboard",
                description:
                  "See application progress and performance at a glance.",
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Status Tracking",
                description:
                  "Track stages like Applied, Interviewing, Offer, or Rejected.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Company Insights",
                description:
                  "Save company details and notes for each opportunity.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Stay Organized",
                description: "Never miss deadlines or forget follow-ups again.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-lg border border-border bg-card"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-heading">
                  {feature.title}
                </h3>
                <p className="text-text">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Add Job Application",
                description:
                  "Enter company name, role, and application details.",
              },
              {
                number: "2",
                title: "Track Progress",
                description:
                  "Update status as you move through interview stages.",
              },
              {
                number: "3",
                title: "Stay Organized",
                description: "Monitor everything from your dashboard.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary text-white">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-heading">
                      {step.title}
                    </h3>
                    <p className="text-text">{step.description}</p>
                  </div>
                </div>

                {i < 2 && (
                  <div className="hidden md:block absolute top-5 -right-8 opacity-30">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Take Control of Your Job Search Today
          </h2>
          <p className="text-lg mb-8 text-white">
            Track smarter. Stay organized. Get hired faster.
          </p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full border border-border text-white bg-primary px-4 py-3 rounded-md hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 text-center text-sm text-text">
        © 2026 Trackr. All rights reserved.
      </footer>
    </div>
  );
}
