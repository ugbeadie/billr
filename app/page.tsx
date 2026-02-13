"use client";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-secondary z-50 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Bayarin</span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <a
              href="#features"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Pricing
            </a>
            <a
              href="#blog"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Blog
            </a>
            <a
              href="#invoice"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Invoice Generator
            </a>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-secondary rounded-b-3xl">
        <div className="max-w-4xl mx-auto text-center pt-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-balance leading-tight text-foreground">
            Invoicing That Helps Small Businesses Get{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-primary">Paid Faster</span>
              <svg
                className="absolute left-0 w-full h-8 -bottom-5"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M 5 25 Q 50 5 95 25"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Helps business owners world-wide make beautiful invoices, look
            professional and get paid faster.
          </p>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-secondary py-12 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground text-sm mb-8">
            Used by thousands worldwide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">Freelancers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">2k+</div>
              <div className="text-sm text-muted-foreground">Agencies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">5k+</div>
              <div className="text-sm text-muted-foreground">Startups</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">$50M+</div>
              <div className="text-sm text-muted-foreground">Invoiced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
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
                className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
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
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-5 -right-12 text-primary/30">
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
            <h2 className="text-4xl font-bold mb-4">Who It's For</h2>
            <p className="text-lg text-muted-foreground">
              If you send invoices, Invoxa is for you
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {["Freelancers", "Agencies", "Consultants", "Small Businesses"].map(
              (audience, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border bg-card text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{audience}</h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade anytime
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <p className="text-muted-foreground mb-6">
                Perfect to get started
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Unlimited invoices</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>PDF downloads</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Client management</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Start Free
              </Button>
            </div>

            <div className="rounded-lg border-2 border-primary bg-card p-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <p className="text-muted-foreground mb-6">
                For growing businesses
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Everything in Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Payment tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Custom branding</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Email receipts</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is this free?",
                a: "Yes! Invoxa is free to use forever. Create unlimited invoices with our Free Plan.",
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
              <div key={i} className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Start Creating Invoices Today
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of freelancers and small businesses using Invoxa
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20 bg-transparent"
          >
            Create Free Invoice
          </Button>
          <p className="text-sm mt-4 opacity-75">✓ No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Invoxa</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional invoicing for freelancers and small businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Invoxa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
