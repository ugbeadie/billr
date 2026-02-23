"use server";

"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { initializeUserBoard } from "@/lib/board";
import { db } from "@/db/drizzle";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    await auth.api.signUpEmail({ body: result.data });

    // Retrieve the created user from the DB
    const [createdUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, result.data.email))
      .limit(1);

    if (!createdUser?.id) {
      throw new Error("User not found after signup");
    }

    // Initialize the user's board and columns
    await initializeUserBoard(createdUser.id);
  } catch (err) {
    const e = err as Error;
    const message = e?.message || "Unable to create account";

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
  } catch (err) {
    const e = err as Error;

    const message = e?.message || "Unable to sign in";

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
