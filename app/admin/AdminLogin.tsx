"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import styles from "./Admin.module.css";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setError(result.error || "Unable to sign in."); setLoading(false); return; }
    router.replace("/admin"); router.refresh();
  }

  return <main className={styles.loginShell}><section className={styles.loginCard}>
    <Image className={styles.logo} src="/assistmyday-logo.webp" alt="Assistmyday" width={350} height={84} priority />
    <p>CONTENT OPERATIONS</p><h1>Admin access.</h1>
    <span>Manage portfolio projects, services, and editorial content from one secure workspace.</span>
    {!configured && <div className={styles.notice}>Admin login is not configured on Hostinger. Add ADMIN_EMAIL, ADMIN_PASSWORD (12+ characters), and ADMIN_AUTH_SECRET (32+ characters), then redeploy.</div>}
    <form className={styles.loginForm} onSubmit={submit}>
      <div className={styles.field}><label htmlFor="email">EMAIL ADDRESS</label><input id="email" name="email" type="email" autoComplete="username" required /></div>
      <div className={styles.field}><label htmlFor="password">PASSWORD</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.primaryButton} disabled={loading}>{loading ? "SIGNING IN…" : "SIGN IN SECURELY"}</button>
    </form><p className={styles.loginNote}>This page is not linked from the public website. All content changes require an authenticated server session.</p>
  </section></main>;
}
