"use client";

import { createAuthClient } from "better-auth/react";

const resolveAuthBaseURL = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }

  const configuredBaseURL =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;

  if (configuredBaseURL) {
    return `${configuredBaseURL.replace(/\/$/, "")}/api/auth`;
  }

  return "http://localhost:3000/api/auth";
};

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
});
