"use client";

import { Fragment, useState } from "react";
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

const socialLinks = [
  { label: "FACEBOOK", href: "https://www.facebook.com/people/Assist-My-Day/61558295810267/" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/assistmyday/?igsh=dXA3ZTFlaWg2NHVz" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/assistmyday/" },
  { label: "TIKTOK", href: "https://www.tiktok.com/@assistmyday" },
];

export default function SiteHeader({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.identity}>
            <Link href="/" className={styles.brand} aria-label="Assistmyday home">
              <Image src="/assistmyday-logo-white.png" alt="Assistmyday" width={2424} height={462} priority unoptimized />
            </Link>
          </div>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navigation.slice(0, -1).map((item, index) => (
              <Fragment key={item.label}>
                {item.label === "SERVICES" ? <div className={styles.desktopServices}>
                  <Link href={item.href} aria-current={active === item.label ? "page" : undefined}>{item.label}</Link>
                  <div className={styles.desktopSubmenu}><Link href="/services/custom-software-development">Custom Software Development <span>↗</span></Link></div>
                </div> : <Link href={item.href} aria-current={active === item.label ? "page" : undefined}>{item.label}</Link>}
                {index < navigation.length - 2 && <span className={styles.navSeparator} aria-hidden="true">/</span>}
              </Fragment>
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
          <div className={styles.mobileNavItem} key={item.label}>
            <Link href={item.href} onClick={() => setMenuOpen(false)} aria-current={active === item.label ? "page" : undefined}>
              <small>{String(index + 1).padStart(2, "0")}</small><span>{item.label}</span><b>↗</b>
            </Link>
            {item.label === "SERVICES" && <>
              <button type="button" className={styles.mobileSubmenuToggle} aria-label="Show Services submenu" aria-expanded={servicesOpen} aria-controls="mobile-services-submenu" onClick={() => setServicesOpen((value) => !value)}>{servicesOpen ? "−" : "+"}</button>
              <div id="mobile-services-submenu" className={`${styles.mobileSubmenu} ${servicesOpen ? styles.mobileSubmenuOpen : ""}`}>
                <Link href="/services/custom-software-development" onClick={() => setMenuOpen(false)}>Custom Software Development <b>↗</b></Link>
              </div>
            </>}
          </div>
        ))}
        <div className={styles.mobileSocials}>
          <small>FOLLOW US</small>
          <div>{socialLinks.map((item) => <a href={item.href} key={item.label} target="_blank" rel="noopener noreferrer">{item.label}<b>↗</b></a>)}</div>
        </div>
      </nav>
    </>
  );
}