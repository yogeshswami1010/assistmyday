"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./InnerPages.module.css";
import FooterNavigation from "./FooterNavigation";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "SERVICES", href: "/services" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/contact" },
];

export default function InnerPages({ children, active }: { children: ReactNode; active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.identity}>
            <Link href="/" className={styles.brand} aria-label="Assistmyday home">
              <Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} priority unoptimized />
            </Link>
            <span className={styles.brandMeta}><b>INTEGRATED DIGITAL</b><small>ST. CATHARINES · CANADA</small></span>
          </div>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navigation.filter((item) => item.label !== "CONTACT").map((item) => <a key={item.label} href={item.href} aria-current={active === item.label ? "page" : undefined}>{item.label}</a>)}
          </nav>
          <Link className={styles.headerCta} href="/contact" aria-current={active === "CONTACT" ? "page" : undefined}>
            <span>START A PROJECT</span><b>↗</b>
          </Link>
          <button className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="inner-mobile-nav">MENU <span>{menuOpen ? "×" : "＝"}</span></button>
        </div>
      </header>

      <nav id="inner-mobile-nav" className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`} aria-label="Mobile navigation">
        {navigation.map((item, index) => (
          <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active === item.label ? "page" : undefined}>
            <small>{String(index + 1).padStart(2, "0")}</small><span>{item.label}</span><b>↗</b>
          </a>
        ))}
      </nav>

      <main>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}><p>READY TO BUILD SOMETHING BETTER?</p><a href="/contact">START A PROJECT <span>↗</span></a></div>
        <FooterNavigation />
        <div className={styles.footerMain}>
          <h2>Software that scales.<br /><em>Marketing that converts.</em></h2>
          <Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} unoptimized />
        </div>
        <div className={styles.footerBase}><span>© ASSISTMYDAY® 2026</span><span>ST. CATHARINES — CANADA</span><Link href="/">BACK HOME ↑</Link></div>
      </footer>
    </div>
  );
}
