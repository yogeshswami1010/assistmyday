import { NextResponse } from "next/server";
import { clearAdminSession, isSameOrigin } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
