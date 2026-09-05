import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission, setContactSubmissionEmailStatus } from "@/lib/content-store";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] || character);
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return NextResponse.json({ ok: true });

  const submission = {
    name: clean(payload.name, 160),
    email: clean(payload.email, 254).toLowerCase(),
    company: clean(payload.company, 180),
    phone: clean(payload.phone, 60),
    message: clean(payload.message, 5000),
    ipAddress: clean(request.headers.get("x-forwarded-for")?.split(",")[0], 64),
    userAgent: clean(request.headers.get("user-agent"), 500),
  };

  if (!submission.name || !EMAIL_PATTERN.test(submission.email) || submission.message.length < 10) {
    return NextResponse.json({ error: "Please enter your name, a valid email, and a message of at least 10 characters." }, { status: 422 });
  }

  let submissionId: number;
  try {
    submissionId = await createContactSubmission(submission);
  } catch (error) {
    console.error("Unable to save contact submission.", error);
    return NextResponse.json({ error: "We could not save your message. Please try again." }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "assistmyday@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    await setContactSubmissionEmailStatus(submissionId, false, "Email service is not configured.");
    console.error("Contact submission saved, but RESEND_API_KEY or CONTACT_FROM_EMAIL is missing.");
    return NextResponse.json({ error: "Your message was saved, but email delivery is temporarily unavailable.", saved: true }, { status: 503 });
  }

  const subject = `New website enquiry from ${submission.name}`;
  const html = `<h2>New Assistmyday contact enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(submission.company || "Not provided")}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone || "Not provided")}</p>
    <p><strong>Message:</strong></p><p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>`;

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: submission.email, subject, html }),
    });
    if (!emailResponse.ok) throw new Error(`Resend returned ${emailResponse.status}: ${await emailResponse.text()}`);
    await setContactSubmissionEmailStatus(submissionId, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    await setContactSubmissionEmailStatus(submissionId, false, message);
    console.error("Contact submission saved, but email delivery failed.", error);
    return NextResponse.json({ error: "Your message was saved, but email delivery failed. We will still review it.", saved: true }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}