"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json() as { ok?: boolean; error?: string; saved?: boolean };
      if (!response.ok) throw new Error(result.error || "Unable to send your message.");
      form.reset();
      setStatus("success");
      setMessage("Thank you. Your project details were sent successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>YOUR NAME<input type="text" name="name" autoComplete="name" maxLength={160} required /></label>
      <label>WORK EMAIL<input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
      <label>COMPANY<input type="text" name="company" autoComplete="organization" maxLength={180} /></label>
      <label>PHONE<input type="tel" name="phone" autoComplete="tel" maxLength={60} /></label>
      <label>HOW CAN WE HELP?<textarea name="message" rows={6} minLength={10} maxLength={5000} required /></label>
      <label aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>WEBSITE<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      <p className={`contact-form-note contact-form-note-${status}`} role="status" aria-live="polite">
        {message || "Your details are sent securely to the Assistmyday team."}
      </p>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "SEND PROJECT DETAILS ↗"}</button>
    </form>
  );
}