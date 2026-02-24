import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema, user as userTable } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { initializeUserBoard } from "@/lib/board";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Reset your password",
          react: ForgotPasswordEmail({
            username: user.name,
            resetUrl: url,
            userEmail: user.email,
          }),
        });
      } catch (error) {
        console.error("Failed to send reset email:", error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          console.log("USER CREATE HOOK FIRED", user);

          try {
            // Ensure we have a valid user ID
            const userId = user.id;

            if (!userId || typeof userId !== "string") {
              console.error("Invalid user ID in hook:", userId);
              return;
            }

            // Verify user exists in database before initializing board
            const dbUser = await db
              .select()
              .from(userTable)
              .where(eq(userTable.id, userId))
              .limit(1);

            if (!dbUser.length) {
              console.error("User not found in database:", userId);
              return;
            }

            console.log(
              "User found in database, initializing board for:",
              userId,
            );
            await initializeUserBoard(userId);
            console.log("Board initialized successfully for:", userId);
          } catch (error) {
            console.error("Error in user create hook:", error);
            throw error;
          }
        },
      },
    },
  },

  plugins: [nextCookies()],
});
