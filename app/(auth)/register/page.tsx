"use client";

import { authClient } from "@/auth-client";
import { signUp } from "@/server/actions";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, null);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.errors) {
      toast.error(
        state.errors[0] || "Registration failed. Please check your input.",
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
            <h1 className="text-2xl font-semibold">Create account</h1>
            <p className="mt-2 text-sm text-text">
              Sign up to access your dashboard and start managing everything in
              one place.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            action={formAction}
            className="space-y-5"
            variants={containerVariants}
          >
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium">Full Name*</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                defaultValue={state?.values?.name ?? ""}
                className="mt-2 h-12 w-full rounded-full border px-5 outline-none focus:border-primary"
              />
            </motion.div>

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
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? "eye-off" : "eye"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-primary text-white font-medium flex items-center justify-center gap-2"
              variants={itemVariants}
            >
              {pending ? "Creating account..." : "Create account"}
            </motion.button>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-3 text-xs text-gray-400"
              variants={itemVariants}
            >
              <div className="h-px flex-1 bg-gray-200" />
              or sign up with
              <div className="h-px flex-1 bg-gray-200" />
            </motion.div>

            {/* Google */}
            <motion.button
              type="button"
              onClick={signInWithGoogle}
              disabled={googlePending}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border bg-transparent font-medium text-text hover:bg-gray-50 disabled:opacity-60"
              variants={itemVariants}
            >
              {googlePending ? "Signing up..." : "Continue with Google"}
            </motion.button>

            {/* Sign in link */}
            <motion.p
              className="mt-6 text-sm text-text text-center"
              variants={itemVariants}
            >
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center bg-primary-light relative overflow-hidden">
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
            alt="Authentication illustration"
            width={900}
            height={900}
            priority
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </div>
  );
}
