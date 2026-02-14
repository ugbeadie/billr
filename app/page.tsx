"use client";
//TODO:MAKE BUTTONS CONSISTENT and WORK ON HOVER EFFECT

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileText,
  Users,
  Download,
  Eye,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* NavBar */}
      <nav className="fixed top-0 w-full z-50 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-heading">Billr</span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <a
              href="#features"
              className="text-sm text-text hover:text-heading transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-text hover:text-heading transition"
            >
              Pricing
            </a>

            <button className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-primary-light">
        <div className="max-w-4xl mx-auto text-center pt-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-balance leading-tight text-heading">
            Invoicing That Helps Small Businesses Get{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-primary">Paid Faster</span>
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
          <p className="text-lg text-balance max-w-2xl mx-auto text-text">
            Helps business owners world-wide make beautiful invoices, look
            professional and get paid faster.
          </p>
          <div className="mt-6 flex justify-center flex-wrap gap-4">
            <button className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition">
              Get started
            </button>

            <button className="bg-white text-primary border border-border px-6 py-2 rounded-md font-medium hover:bg-card transition">
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8  bg-primary-light">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm mb-8 text-text">
            Used by thousands worldwide
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center ">
            {[
              ["10k+", "Freelancers"],
              ["2k+", "Agencies"],
              ["5k+", "Startups"],
              ["$50M+", "Invoiced"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold mb-1 text-heading text-primary">
                  {value}
                </div>
                <div className="text-sm text-text">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              Powerful Features
            </h2>
            <p className="text-lg text-text">
              Everything you need to invoice like a pro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Create Invoices Fast",
                description:
                  "Build invoices with auto-calculated totals and taxes in seconds",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Client Management",
                description:
                  "Save clients and reuse them anytime for faster invoicing",
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "Download PDFs",
                description: "Professional, print-ready invoices ready to send",
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Track Payments",
                description:
                  "See paid and unpaid invoices instantly at a glance",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Dashboard Overview",
                description:
                  "Monitor your revenue and business metrics in real-time",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Professional Templates",
                description:
                  "Choose from beautiful, customizable invoice templates",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-heading">
                  {feature.title}
                </h3>
                <p className="text-text">{feature.description}</p>
              </div>
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
            <p className="text-lg text-text">
              Simple steps to professional invoicing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Add Your Business & Client",
                description:
                  "Set up your profile and save client information for quick access",
              },
              {
                number: "2",
                title: "Create an Invoice",
                description:
                  "Add items, set payment terms, and customize your invoice",
              },
              {
                number: "3",
                title: "Download or Send",
                description:
                  "Get a professional PDF or send directly to your client",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-primary text-white">
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
                  <div className="hidden md:block absolute top-5 -right-8 opacity-30 text-heading">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              Who It's For
            </h2>
            <p className="text-lg text-text">
              If you send invoices, Billr is for you
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {["Freelancers", "Agencies", "Consultants", "Small Businesses"].map(
              (audience, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border bg-card text-center"
                >
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-heading">{audience}</h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-light"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              Simple Pricing
            </h2>
            <p className="text-lg text-text">Start free, upgrade anytime</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="rounded-lg border border-border bg-white p-8">
              <h3 className="text-2xl font-bold mb-2 text-heading">
                Free Plan
              </h3>
              <p className="mb-6 text-text">Perfect to get started</p>

              <div className="space-y-3 mb-8">
                {[
                  "Unlimited invoices",
                  "PDF downloads",
                  "Client management",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-border text-heading hover:bg-card"
              >
                Start Free
              </Button>
            </div>

            <div className="rounded-lg border-2 border-primary bg-white p-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-heading">Pro Plan</h3>
              <p className="mb-6 text-text">For growing businesses</p>
              <div className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Payment tracking",
                  "Custom branding",
                  "Email receipts",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-primary hover:bg-primary-light text-white">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is this free?",
                a: "Yes! Billr is free to use forever. Create unlimited invoices with our Free Plan.",
              },
              {
                q: "Can I download invoices as PDF?",
                a: "Absolutely. All invoices can be downloaded as professional PDFs ready to print or send.",
              },
              {
                q: "Do my clients need an account?",
                a: "No. Your clients can view and pay invoices without creating an account.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use industry-standard encryption and secure servers to protect your data.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border bg-card"
              >
                <h3 className="font-semibold text-lg mb-2 text-heading">
                  {item.q}
                </h3>
                <p className="text-text">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Start Creating Invoices Today
          </h2>
          <p className="text-lg mb-8 text-white">
            Join thousands of freelancers and small businesses using Billr
          </p>

          <Button
            size="lg"
            variant="outline"
            className="w-full border-border text-white bg-primary hover:bg-card"
          >
            Create Free Invoice
          </Button>

          <p className="text-sm mt-4 text-white">✓ No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-primary text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-bold text-heading">Billr</span>
              </div>
              <p className="text-sm text-text">
                Professional invoicing for freelancers and small businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-heading">Product</h4>
              <ul className="space-y-2 text-sm">
                {["features", "pricing", "faq"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link}`}
                      className="text-text hover:text-heading transition"
                    >
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-heading">Company</h4>
              <ul className="space-y-2 text-sm">
                {["About", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-text hover:text-heading transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-heading">Legal</h4>
              <ul className="space-y-2 text-sm">
                {["Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-text hover:text-heading transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-text">
            <p>© 2026 Billr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
