"use client";

import { authClient } from "@/auth-client";
import { signIn } from "@/server/actions";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.errors) {
      toast.error(
        state.errors[0] || "Login failed. Please check your credentials.",
      );
    }
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

  return (
    <div className="min-h-screen bg-primary-light grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <div className="flex items-center justify-center px-6">
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
              Sign in to access your dashboard and manage everything in one
              place.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            action={formAction}
            className="space-y-5"
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
            <motion.div
              className="flex justify-end text-sm"
              variants={itemVariants}
            >
              <Link href="/forgot-password" className="text-primary">
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit button */}
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
              className="flex items-center gap-3 text-xs text-gray-400"
              variants={itemVariants}
            >
              <div className="h-px flex-1 bg-gray-200" />
              or sign in with
              <div className="h-px flex-1 bg-gray-200" />
            </motion.div>

            {/* Google button */}
            <motion.button
              type="button"
              onClick={signInWithGoogle}
              disabled={googlePending}
              className="h-12 w-full rounded-full border flex items-center justify-center gap-3"
              variants={itemVariants}
            >
              {googlePending ? "Signing in..." : "Continue with Google"}
            </motion.button>

            {/* Sign up link */}
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

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0, 1, 1] }}
          transition={{
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6 },
          }}
          className="relative w-full max-w-md px-10"
        >
          <Image
            src="/images/authimg.png"
            alt="Auth illustration"
            width={900}
            height={900}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
