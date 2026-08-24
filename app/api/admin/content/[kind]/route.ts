import { NextResponse } from "next/server";
import { getAdminSession, isSameOrigin } from "../../../../../lib/admin-auth";
import { createContent, getBlogArticles, getPortfolioProjects, getServices, isDatabaseConfigured } from "../../../../../lib/content-store";
import { isContentKind, parseContent } from "../../../../../lib/content-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize() {
  return Boolean(await getAdminSession());
}

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { kind } = await params;
  if (!isContentKind(kind)) return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const items = kind === "portfolio" ? await getPortfolioProjects(true, true) : kind === "services" ? await getServices(true, true) : await getBlogArticles(true, true);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Database connection is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { kind } = await params;
  if (!isContentKind(kind)) return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const value = parseContent(kind, await request.json());
    const id = await createContent(kind, value);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY";
    return NextResponse.json({ error: duplicate ? "That slug is already in use." : message }, { status: duplicate ? 409 : 400 });
  }
}
