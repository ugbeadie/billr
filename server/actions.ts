"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type ActionState = {
  errors?: Record<string, string[]>;
  values?: {
    name?: string;
    email?: string;
  };
};

export async function signUp(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const result = signUpSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  try {
    await auth.api.signUpEmail({
      body: result.data,
    });
  } catch (err: any) {
    const message =
      err?.message || err?.error?.message || "Unable to create account";

    return {
      errors: {
        email: [message],
      },
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  redirect("/dashboard");
}

export async function signIn(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const result = signInSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: { email: rawData.email },
    };
  }

  try {
    await auth.api.signInEmail({
      body: result.data,
    });
  } catch (err: any) {
    const message = err?.message || err?.error?.message || "Unable to sign in";

    return {
      errors: {
        email: [message],
      },
      values: {
        email: rawData.email,
      },
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}
