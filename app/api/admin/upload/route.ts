import { NextResponse } from "next/server";
import { getAdminSession, isSameOrigin } from "../../../../lib/admin-auth";
import { createMedia, isDatabaseConfigured } from "../../../../lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function detectedImageType(data: Buffer) {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (data.length >= 12 && data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString("ascii"))) return "image/gif";
  return null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });

  try {
    const form = await request.formData();
    const image = form.get("image");
    if (!(image instanceof File)) return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
    if (image.size < 1) return NextResponse.json({ error: "The selected image is empty." }, { status: 400 });
    if (image.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: "The image must be 5 MB or smaller." }, { status: 413 });

    const data = Buffer.from(await image.arrayBuffer());
    const contentType = detectedImageType(data);
    if (!contentType) {
      return NextResponse.json({ error: "Use a JPEG, PNG, WebP, or GIF image." }, { status: 415 });
    }

    const id = await createMedia(image.name || "blog-image", contentType, data);
    return NextResponse.json({ url: "/api/media/" + id }, { status: 201 });
  } catch (error) {
    console.error("Blog image upload failed.", error);
    return NextResponse.json({ error: "The image could not be uploaded. Check the database connection and try again." }, { status: 500 });
  }
}