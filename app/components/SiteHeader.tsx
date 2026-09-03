"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./InnerPages.module.css";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "SERVICES", href: "/services" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/contact" },
];

export default function SiteHeader({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.identity}>
            <Link href="/" className={styles.brand} aria-label="Assistmyday home">
              <Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} priority unoptimized />
            </Link>
          </div>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navigation.filter((item) => item.label !== "CONTACT").map((item) => (
              <Link key={item.label} href={item.href} aria-current={active === item.label ? "page" : undefined}>{item.label}</Link>
            ))}
          </nav>
          <Link className={styles.headerCta} href="/contact" aria-current={active === "CONTACT" ? "page" : undefined}>
            <span>START A PROJECT</span><b>↗</b>
          </Link>
          <button className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="site-mobile-nav">
            MENU <span>{menuOpen ? "×" : "＝"}</span>
          </button>
        </div>
      </header>

      <nav id="site-mobile-nav" className={menuOpen ? [styles.mobileNav, styles.mobileNavOpen].join(" ") : styles.mobileNav} aria-label="Mobile navigation">
        {navigation.map((item, index) => (
          <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active === item.label ? "page" : undefined}>
            <small>{String(index + 1).padStart(2, "0")}</small><span>{item.label}</span><b>↗</b>
          </Link>
        ))}
      </nav>
    </>
  );
}