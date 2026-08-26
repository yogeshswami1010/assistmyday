import { getMedia, isDatabaseConfigured } from "../../../../lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: value } = await params;
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) return new Response("Not found", { status: 404 });
  if (!isDatabaseConfigured()) return new Response("Media storage is unavailable", { status: 503 });

  try {
    const media = await getMedia(id);
    if (!media) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(media.data), {
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Media delivery failed.", error);
    return new Response("Media storage is unavailable", { status: 503 });
  }
}