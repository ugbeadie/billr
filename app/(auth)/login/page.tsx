"use client";

import { authClient } from "@/auth-client";
import { signIn } from "@/server/actions";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state?.errors) return;

    const firstError = Object.values(state.errors)[0]?.[0];

    toast.error(firstError || "Login failed.");
  }, [state]);

  const signInWithGoogle = async () => {
    try {
      setGooglePending(true);
      toast.loading("Redirecting to Google...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("Google sign-in failed.");
    } finally {
      setGooglePending(false);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const GoogleIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.7 0 5.2 1 7.1 2.7l5.7-5.7C33.7 6.7 29.1 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21 21-9.4 21-21c0-1.8-.2-3.5-.4-5.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.7 0 5.2 1 7.1 2.7l5.7-5.7C33.7 6.7 29.1 5 24 5c-8.2 0-15.2 4.7-18.7 11.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 47c5.1 0 9.8-2 13.4-5.3l-6.2-5.1C29.4 38.5 26.8 39.5 24 39.5c-5.1 0-9.5-3.1-11.1-7.4l-6.6 5.1C8.8 42.3 15.8 47 24 47z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.4 5.5-6.1 6.9l6.2 5.1C38.9 36.6 45 31 45 26c0-1.8-.2-3.5-.4-5.5z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-6 text-center" variants={itemVariants}>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-text">
            Welcome back. Let’s continue your job search journey.{" "}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          action={formAction}
          className="space-y-2"
          variants={containerVariants}
        >
          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">Email*</label>
            <input
              name="email"
              type="email"
              placeholder="mail@website.com"
              defaultValue={state?.values?.email ?? ""}
              className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">Password*</label>
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 w-full rounded-full border px-5 pr-12 outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showPassword ? "off" : "on"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          {/* Forgot password */}
          {/* <motion.div
            className="flex justify-end text-sm"
            variants={itemVariants}
          >
            <Link href="/forgot-password" className="text-primary">
              Forgot password?
            </Link>
          </motion.div> */}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full bg-primary text-white font-medium flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            {pending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {pending ? "Logging in..." : "Login"}
          </motion.button>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-3 text-xs text-gray-400 my-4"
            variants={itemVariants}
          >
            <div className="h-px flex-1 bg-gray-200" />
            or sign in with
            <div className="h-px flex-1 bg-gray-200" />
          </motion.div>

          {/* Google */}
          <motion.button
            type="button"
            onClick={signInWithGoogle}
            disabled={googlePending}
            className="h-12 w-full rounded-full border flex items-center justify-center gap-3"
            variants={itemVariants}
          >
            {!googlePending && <GoogleIcon />}
            {googlePending ? "Signing in..." : "Continue with Google"}
          </motion.button>

          {/* Sign up */}
          <motion.p
            className="mt-6 text-sm text-center"
            variants={itemVariants}
          >
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary">
              Sign up
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
}
