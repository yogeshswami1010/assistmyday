"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ContactForm from "../contact/ContactForm";
import styles from "./CustomSoftwareExperience.module.css";

const capabilities = [
  ["01", "Web applications", "Secure, responsive products that simplify complex customer and team workflows."],
  ["02", "Business portals", "One clear place for clients, partners, and employees to access the tools and information they need."],
  ["03", "API integrations", "Reliable connections between your CRM, payments, data, and third-party platforms."],
  ["04", "Workflow automation", "Purpose-built automation that removes repetitive work and keeps operations moving."],
] as const;

const process = [
  ["01", "Discover", "Map the users, workflow, constraints, and business outcome."],
  ["02", "Design", "Shape the product architecture, experience, and delivery roadmap."],
  ["03", "Build", "Develop in visible milestones with testing and regular feedback."],
  ["04", "Evolve", "Launch, measure, support, and improve as your needs change."],
] as const;

const stack = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "REST & GraphQL", "AWS & Azure"];

export default function CustomSoftwareExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible)),
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );
    items.forEach((item) => observer.observe(item));
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--pointer-x", x.toFixed(3));
      root.style.setProperty("--pointer-y", y.toFixed(3));
    };
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.experience}>
      <section className={styles.hero} aria-labelledby="software-title">
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.heroTop}><p>ASSISTMYDAY / SERVICES / 01</p><span>CUSTOM SOFTWARE DEVELOPMENT</span></div>
        <div className={styles.softwareVisual} aria-hidden="true">
          <div className={styles.softwareHeader}><span>PRODUCT SYSTEM / 01</span><b>● OPERATIONAL</b></div>
          <div className={styles.softwareCanvas}>
            <div className={styles.softwareCore}><small>CORE</small><strong>AMD</strong><i /></div>
            <div className={`${styles.softwareModule} ${styles.modulePortal}`}><small>01</small><span>CLIENT<br/>PORTAL</span></div>
            <div className={`${styles.softwareModule} ${styles.moduleData}`}><small>02</small><span>LIVE<br/>DATA</span></div>
            <div className={`${styles.softwareModule} ${styles.moduleCrm}`}><small>03</small><span>CRM<br/>SYNC</span></div>
            <div className={`${styles.softwareModule} ${styles.moduleFlow}`}><small>04</small><span>AUTO<br/>FLOW</span></div>
            <svg viewBox="0 0 600 330" preserveAspectRatio="none"><path d="M300 165 L105 75 M300 165 L495 75 M300 165 L105 260 M300 165 L495 260"/></svg>
          </div>
          <div className={styles.softwareFooter}><span>4 CONNECTED MODULES</span><span>SYNC 12ms</span></div>
        </div>
        <div className={styles.heroContent}>
          <div><small>SYSTEMS THAT SCALE</small><h1 id="software-title">Software built<br />around <em>your business.</em></h1></div>

        </div>
        <div className={styles.scrollCue}><span>↓</span> EXPLORE THE SYSTEM</div>
      </section>

      <div className={styles.marquee} aria-hidden="true"><div>PLATFORMS <i>✦</i> PORTALS <i>✦</i> AUTOMATION <i>✦</i> INTEGRATIONS <i>✦</i> DASHBOARDS <i>✦</i> PLATFORMS <i>✦</i> PORTALS <i>✦</i> AUTOMATION <i>✦</i> INTEGRATIONS <i>✦</i> DASHBOARDS <i>✦</i></div></div>

      <section className={styles.intro} data-section-marker="01 / WHY CUSTOM">
        <p className={styles.eyebrow}>THE RIGHT FIT</p>
        <div className={`${styles.introCopy} ${styles.reveal}`}>
          <h2>When off-the-shelf<br />software creates<br /><em>more work.</em></h2>
          <p>Custom software gives your team one connected system instead of scattered spreadsheets, manual handoffs, and tools that never quite fit. We focus every decision on clarity, adoption, and measurable operational value.</p>
        </div>
        <div className={`${styles.outcomes} ${styles.reveal}`}>
          <article><strong>01</strong><span>EFFICIENCY</span><p>Reduce repetitive work</p><b>−42%</b></article>
          <article><strong>02</strong><span>CONNECTION</span><p>Connect essential systems</p><b>01</b></article>
          <article><strong>03</strong><span>CLARITY</span><p>Turn data into decisions</p><b>24/7</b></article>
        </div>
      </section>

      <section className={styles.capabilitySection} aria-labelledby="capabilities-title">
        <header className={`${styles.sectionHeader} ${styles.reveal}`}><p>WHAT WE BUILD</p><h2 id="capabilities-title">One foundation.<br /><em>Many possibilities.</em></h2></header>
        <div className={styles.capabilities}>{capabilities.map(([number, title, copy], index) => (
          <article className={`${styles.capability} ${styles.reveal}`} style={{ transitionDelay: `${index * 70}ms` }} key={number}>
            <div><span>{number}</span><b aria-hidden="true">↗</b></div><div className={styles.capabilityGraphic} aria-hidden="true"><i /><i /><i /></div><h3>{title}</h3><p>{copy}</p>
          </article>
        ))}</div>
      </section>

      <section className={styles.processSection} aria-labelledby="delivery-title">
        <header className={`${styles.processHeader} ${styles.reveal}`}><p>HOW WE DELIVER</p><h2 id="delivery-title">Clear milestones.<br /><em>Visible progress.</em></h2></header>
        <div className={styles.process}>{process.map(([number, title, copy]) => (
          <article className={styles.reveal} key={number}><span>{number}</span><div className={styles.dot} /><h3>{title}</h3><p>{copy}</p></article>
        ))}</div>
      </section>

      <section className={styles.stackSection}>
        <div className={`${styles.stackIntro} ${styles.reveal}`}><p>TECHNOLOGY</p><h2>Modern tools.<br /><em>Practical choices.</em></h2></div>
        <div className={styles.stack}>{stack.map((item, index) => <span className={styles.reveal} style={{ transitionDelay: `${(index % 4) * 60}ms` }} key={item}><small>{String(index + 1).padStart(2, "0")}</small>{item}</span>)}</div>
      </section>

      <section className={styles.contactSection} aria-labelledby="software-contact-title">
        <div className={`${styles.contactIntro} ${styles.reveal}`}>
          <p>START A SOFTWARE PROJECT</p>
          <h2 id="software-contact-title">Tell us what<br />needs to work <em>better.</em></h2>
          <span>Share the workflow, system, or operational challenge you want to improve. We’ll respond with practical next steps.</span>
          <div><a href="mailto:info@assistmyday.com">info@assistmyday.com</a><a href="tel:+19053748878">+1 (905) 374-8878</a></div>
        </div>
        <div className={`${styles.contactFormWrap} ${styles.reveal}`}><ContactForm /></div>
      </section>
    </div>
  );
}
