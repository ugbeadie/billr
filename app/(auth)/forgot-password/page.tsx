"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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

    if (error) console.error("Error sending reset password link:", error);

    setPending(false);

    if (error) {
      toast.error("Failed to send reset link.");
      return;
    }

    toast.success("Password reset link sent! Check your email.");
  }

  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="mt-2 text-sm text-text">
              Enter your email and we’ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email*</label>
              <input
                name="email"
                type="email"
                required
                placeholder="mail@website.com"
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-primary text-white font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {pending ? "Sending link..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text text-center">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
