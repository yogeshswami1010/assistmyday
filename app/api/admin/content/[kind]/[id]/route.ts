import { NextResponse } from "next/server";
import { getAdminSession, isSameOrigin } from "../../../../../../lib/admin-auth";
import { deleteContent, isDatabaseConfigured, updateContent } from "../../../../../../lib/content-store";
import { isContentKind, parseContent } from "../../../../../../lib/content-validation";

export const runtime = "nodejs";

async function context(params: Promise<{ kind: string; id: string }>) {
  const values = await params;
  return { ...values, id: Number(values.id) };
}

export async function PUT(request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { kind, id } = await context(params);
  if (!isContentKind(kind) || !Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid content record." }, { status: 400 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    await updateContent(kind, id, parseContent(kind, await request.json()));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update content.";
    const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY";
    return NextResponse.json({ error: duplicate ? "That slug is already in use." : message }, { status: duplicate ? 409 : 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { kind, id } = await context(params);
  if (!isContentKind(kind) || !Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid content record." }, { status: 400 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  await deleteContent(kind, id);
  return NextResponse.json({ ok: true });
}
