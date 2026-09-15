"use client";

import { useState, type CSSProperties } from "react";
import styles from "./MenuScreen.module.css";

const links = [
  { label: "HOME", href: "/", note: "Overview and capabilities" },
  { label: "PORTFOLIO", href: "/portfolio", note: "Selected work and outcomes" },
  { label: "SERVICES", href: "/services", note: "Software, web, and marketing" },
  { label: "BLOG", href: "/blog", note: "Ideas for better digital growth" },
  { label: "CONTACT", href: "/contact", note: "Start a conversation" },
];

export default function MenuScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
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
            <div className={styles.navItem} key={item.label}>
            <a
              href={item.href}
              onClick={onClose}
              style={{ "--delay": `${index * 55}ms` } as CSSProperties}
              tabIndex={open ? 0 : -1}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{item.label}</span>
              <em>{item.note}</em>
              <b aria-hidden="true">↗</b>
            </a>
            {item.label === "SERVICES" && <>
              <button className={styles.submenuToggle} type="button" aria-label="Show Services submenu" aria-expanded={servicesOpen} aria-controls="services-submenu" onClick={() => setServicesOpen((value) => !value)} tabIndex={open ? 0 : -1}>{servicesOpen ? "−" : "+"}</button>
              <div id="services-submenu" className={`${styles.submenu} ${servicesOpen ? styles.submenuOpen : ""}`}>
                <a href="/services/custom-software-development" onClick={onClose} tabIndex={open && servicesOpen ? 0 : -1}><small>01 / SOFTWARE</small><span>Custom Software Development</span><b aria-hidden="true">↗</b></a>
                <a href="/services/websites-ecommerce" onClick={onClose} tabIndex={open && servicesOpen ? 0 : -1}><small>02 / WEB</small><span>Websites &amp; E-commerce</span><b aria-hidden="true">↗</b></a>
                <a href="/services/performance-marketing" onClick={onClose} tabIndex={open && servicesOpen ? 0 : -1}><small>03 / GROWTH</small><span>Performance Marketing</span><b aria-hidden="true">↗</b></a>
                <a href="/services/brand-content-social" onClick={onClose} tabIndex={open && servicesOpen ? 0 : -1}><small>04 / BRAND</small><span>Brand, Content &amp; Social</span><b aria-hidden="true">↗</b></a>
              </div>
            </>}
            </div>
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
