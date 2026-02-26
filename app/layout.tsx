import React from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trackr – Job Application Tracker",
    template: "%s | Trackr",
  },
  description:
    "Track job applications, manage interviews, monitor statuses, and stay organized throughout your job search journey.",
  keywords: [
    "job tracker",
    "application tracker",
    "kanban job board",
    "job search manager",
    "track applications",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
