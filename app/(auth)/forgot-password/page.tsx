"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setPending(false);

    if (error) {
      toast.error("Failed to send reset link.");
      return;
    }

    toast.success("Password reset link sent! Check your email.");
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-primary-light grid grid-cols-1">
      <div className="flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div className="mb-6 text-center" variants={itemVariants}>
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="mt-2 text-sm text-text">
              Enter your email and we’ll send you a link to reset your password.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={containerVariants}
          >
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium">Email*</label>
              <input
                name="email"
                type="email"
                required
                placeholder="mail@website.com"
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-primary text-white font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              variants={itemVariants}
            >
              {pending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {pending ? "Sending link..." : "Send reset link"}
            </motion.button>
          </motion.form>

          {/* Back to login */}
          <motion.p
            className="mt-6 text-sm text-text text-center"
            variants={itemVariants}
          >
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
