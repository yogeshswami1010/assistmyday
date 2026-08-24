import { NextResponse } from "next/server";
import { createAdminSession, isAdminAuthConfigured, isSameOrigin, verifyAdminCredentials } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: "Admin access has not been configured yet." }, { status: 503 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= 6) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email || "";
  const password = body?.password || "";
  if (!verifyAdminCredentials(email, password)) {
    attempts.set(ip, current && current.resetAt > now ? { ...current, count: current.count + 1 } : { count: 1, resetAt: now + 15 * 60 * 1000 });
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  attempts.delete(ip);
  await createAdminSession(email);
  return NextResponse.json({ ok: true });
}
