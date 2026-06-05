import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

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

  const body = await request.json().catch(() => null);
  const submittedPasscode = body?.passcode;

  if (!submittedPasscode || submittedPasscode !== passcode) {
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
