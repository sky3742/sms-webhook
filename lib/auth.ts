import { db } from "@/lib/repo/db";
import * as schema from "@/lib/repo/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is required. Set it in your environment before starting the app.",
  );
}

const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: trustedOrigins?.length ? trustedOrigins : undefined,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  plugins: [nextCookies()],
});
