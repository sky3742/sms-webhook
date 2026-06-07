import { auth } from "@/lib/auth";
import { timingSafeCompare } from "@/lib/utils/crypto";
import { NextResponse } from "next/server";

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const passcode = process.env.AUTH_PASSCODE;
  const adminEmail = process.env.AUTH_ADMIN_EMAIL;
  const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

  if (!passcode || !adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Passcode authentication is not configured" },
      { status: 500 },
    );
  }

  const key = getRateLimitKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const submittedPasscode = body?.passcode;

  if (
    !submittedPasscode ||
    typeof submittedPasscode !== "string" ||
    !timingSafeCompare(submittedPasscode, passcode)
  ) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const resp = await auth.api.signInEmail({
    body: { email: adminEmail, password: adminPassword },
    asResponse: true,
    headers: request.headers,
  });

  const response = NextResponse.json({ ok: true }, { status: resp.status });

  const setCookie = resp.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
