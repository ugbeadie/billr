"use client";

import { authClient } from "@/auth-client";
import { signIn } from "@/server/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import GoogleIcon from "@/components/auth/GoogleIcon";
import FormError from "@/components/auth/FormError";
import { authContainer, authItem } from "@/components/auth/motion";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Wrong credentials come back from the server under `email`, so that field
  // carries both validation and auth failures.
  const formError = state?.errors?.form?.[0];
  const emailError = state?.errors?.email?.[0];
  const passwordError = state?.errors?.password?.[0];

  const signInWithGoogle = async () => {
    try {
      setGooglePending(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("Google sign-in failed.");
      setGooglePending(false);
    }
  };

  const busy = pending || googlePending;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
    >
      <motion.form
        action={formAction}
        variants={authContainer}
        className="mt-6 space-y-4"
      >
        <FormError message={formError} />

        <motion.div variants={authItem}>
          <AuthField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            defaultValue={state?.values?.email ?? ""}
            error={emailError}
          />
        </motion.div>

        <motion.div variants={authItem}>
          <AuthField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            error={passwordError}
          >
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#9CA3AF] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </AuthField>
        </motion.div>

        <motion.button
          variants={authItem}
          type="submit"
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#3A9AFF] text-sm font-medium text-white transition-colors hover:bg-[#2c8ef5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Signing in..." : "Log in"}
        </motion.button>

        <motion.div
          variants={authItem}
          className="flex items-center gap-3 py-1 text-xs text-[#9CA3AF]"
        >
          <span className="h-px flex-1 bg-[#E5E7EB]" />
          or
          <span className="h-px flex-1 bg-[#E5E7EB]" />
        </motion.div>

        <motion.button
          variants={authItem}
          type="button"
          onClick={signInWithGoogle}
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50 disabled:opacity-60"
        >
          {googlePending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <GoogleIcon />
          )}
          {googlePending ? "Redirecting..." : "Continue with Google"}
        </motion.button>
      </motion.form>

      <motion.p
        variants={authItem}
        className="mt-6 text-center text-sm text-[#6B7280]"
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="rounded font-medium text-[#3A9AFF] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50"
        >
          Create one
        </Link>
      </motion.p>
    </AuthShell>
  );
}
