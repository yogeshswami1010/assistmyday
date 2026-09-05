import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL || "assistmyday@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || smtpUser;
  if (!smtpUser || !smtpPassword || !from) {
    await setContactSubmissionEmailStatus(submissionId, false, "SMTP is not configured.");
    console.error("Contact submission saved, but SMTP_USER or SMTP_PASSWORD is missing.");
    return NextResponse.json({ error: "Your message was saved, but email delivery is temporarily unavailable.", saved: true }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  const subject = `New website enquiry from ${submission.name}`;
  const html = `<h2>New Assistmyday contact enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(submission.company || "Not provided")}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone || "Not provided")}</p>
    <p><strong>Message:</strong></p><p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>`;

  try {
    await transporter.sendMail({
      from: { name: "Assistmyday Website", address: from },
      to,
      replyTo: submission.email,
      subject,
      text: `New Assistmyday contact enquiry\n\nName: ${submission.name}\nEmail: ${submission.email}\nCompany: ${submission.company || "Not provided"}\nPhone: ${submission.phone || "Not provided"}\n\nMessage:\n${submission.message}`,
      html,
    });
    await setContactSubmissionEmailStatus(submissionId, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    await setContactSubmissionEmailStatus(submissionId, false, message);
    console.error("Contact submission saved, but email delivery failed.", error);
    return NextResponse.json({ error: "Your message was saved, but email delivery failed. We will still review it.", saved: true }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}