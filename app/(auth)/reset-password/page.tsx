"use client";

import Link from "next/link";
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/auth-client";

export default function ResetPasswordPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    const { error } = await authClient.resetPassword({
      token,
      newPassword: password,
    });

    setPending(false);

    if (error) {
      setError(error.message || "Failed to reset password.");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="mt-2 text-sm text-text">
              Enter a new password for your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">New password*</label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm password*</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-primary text-white font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {pending ? "Resetting password..." : "Reset password"}
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
