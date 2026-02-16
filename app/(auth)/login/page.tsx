"use client";

import { authClient } from "@/auth-client";
import { signIn } from "@/server/actions";
import { EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);
  const [googlePending, setGooglePending] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setGooglePending(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } finally {
      setGooglePending(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-sm text-text">
              Sign in to access your dashboard and manage everything in one
              place.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email*</label>
              <input
                name="email"
                type="email"
                placeholder="mail@website.com"
                defaultValue={state?.values?.email ?? ""}
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />

              {state?.errors?.email && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
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

              {state?.errors?.password && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Forgot */}
            <div className="flex justify-end text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
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
              {pending ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              or sign in with
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={googlePending}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border bg-transparent font-medium text-text hover:bg-gray-50 disabled:opacity-60"
            >
              {googlePending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              )}

              {!googlePending && (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10.1-2 13.7-5.3l-6.3-5.2C29.5 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.3 39.6 16.1 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 2.9-3.3 5.1-6 6.5l6.3 5.2C39.1 36.3 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
                  />
                </svg>
              )}

              {googlePending ? "Signing in..." : "Continue with Google"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block bg-primary/10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(58,154,255,0.35),transparent_60%)]" />
      </div>
    </div>
  );
}
