"use client";

import type { CSSProperties } from "react";
import styles from "./MenuScreen.module.css";

const links = [
  { label: "HOME", href: "/", note: "Overview and capabilities" },
  { label: "PORTFOLIO", href: "/portfolio", note: "Selected work and outcomes" },
  { label: "SERVICES", href: "/services", note: "Software, web, and marketing" },
  { label: "BLOG", href: "/blog", note: "Ideas for better digital growth" },
  { label: "CONTACT", href: "/contact", note: "Start a conversation" },
];

export default function MenuScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside className={`${styles.screen} ${open ? styles.open : ""}`} aria-hidden={!open}>
      <div className={styles.ambient} aria-hidden="true"><i /><i /><i /></div>

      <div className={styles.topline}>
        <span>NAVIGATION / 05</span>
        <p>SOFTWARE · WEB · MARKETING · BRAND</p>
      </div>

      <div className={styles.layout}>
        <nav aria-label="Main navigation">
          {links.map((item, index) => (
            <a
              href={item.href}
              onClick={onClose}
              key={item.label}
              style={{ "--delay": `${index * 55}ms` } as CSSProperties}
              tabIndex={open ? 0 : -1}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{item.label}</span>
              <em>{item.note}</em>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </nav>

        <section className={styles.contactRail}>
          <div className={styles.railMark} aria-hidden="true"><i /><i /><i /><b /></div>
          <p>ONE PARTNER.<br />FROM IDEA TO <em>IMPACT.</em></p>
          <div>
            <small>START A PROJECT</small>
            <a href="mailto:info@assistmyday.com">info@assistmyday.com</a>
            <a href="tel:+19053748878">+1 (905) 374-8878</a>
          </div>
          <a className={styles.projectLink} href="/contact" onClick={onClose}>LET&apos;S TALK <span>↗</span></a>
        </section>
      </div>

      <div className={styles.bottomline}>
        <p>ST. CATHARINES, ONTARIO — CANADA</p>
        <span>© ASSISTMYDAY® 2026</span>
        <div><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LINKEDIN</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a></div>
      </div>
    </aside>
  );
}
