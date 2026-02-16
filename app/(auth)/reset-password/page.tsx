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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Password*</label>

              <div className="relative mt-2">
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-full border px-5 pr-12 outline-none focus:border-primary"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password*</label>

              <div className="relative mt-2">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-full border px-5 pr-12 outline-none focus:border-primary"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

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
