"use client";

import { useEffect, useRef } from "react";
import styles from "./ServicesExperience.module.css";

const services = [
  {
    number: "01",
    title: "Custom Software Development",
    label: "SYSTEMS THAT SCALE",
    copy: "Purpose-built platforms, portals, dashboards, and automations designed around the way your organization actually works.",
    items: ["Web applications", "Business portals", "API integrations", "Workflow automation"],
    motif: "rings",
  },
  {
    number: "02",
    title: "Websites & E-commerce",
    label: "EXPERIENCES THAT CONVERT",
    copy: "Fast, accessible, conversion-focused websites and commerce journeys that communicate clearly and create measurable action.",
    items: ["UX strategy", "Web design", "Development", "E-commerce"],
    motif: "frame",
  },
  {
    number: "03",
    title: "Performance Marketing",
    label: "GROWTH YOU CAN MEASURE",
    copy: "Connected search, paid media, content, CRO, and analytics programs that turn attention into qualified demand.",
    items: ["SEO", "Paid media", "Content", "Analytics & CRO"],
    motif: "signal",
  },
  {
    number: "04",
    title: "Brand, Content & Social",
    label: "RECOGNITION THAT LASTS",
    copy: "Distinctive identities and channel-ready creative systems that build recognition, trust, and long-term audience engagement.",
    items: ["Brand strategy", "Visual identity", "Campaigns", "Social content"],
    motif: "orbit",
  },
] as const;

const process = [
  ["01", "Discover", "We clarify the challenge, audience, operational context, and success measures."],
  ["02", "Define", "We turn the opportunity into a practical roadmap, scope, and delivery plan."],
  ["03", "Build", "We design, develop, launch, and measure with one accountable senior team."],
  ["04", "Grow", "We optimize performance, expand capabilities, and improve results over time."],
] as const;

export default function ServicesExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reveals = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible)),
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    reveals.forEach((element) => observer.observe(element));

    const panels = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.servicePanel}`));
    const onPointerMove = (event: PointerEvent) => {
      const panel = (event.target as HTMLElement).closest<HTMLElement>(`.${styles.servicePanel}`);
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      panel.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    panels.forEach((panel) => panel.addEventListener("pointermove", onPointerMove));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = root.getBoundingClientRect();
        const total = Math.max(1, root.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        root.style.setProperty("--page-progress", progress.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      panels.forEach((panel) => panel.removeEventListener("pointermove", onPointerMove));
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.experience}>
      <section className={styles.hero} aria-labelledby="services-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroOrb} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.heroTop}>
          <p>ASSISTMYDAY / OUR SERVICES</p>
          <span>STRATEGY · DESIGN · TECHNOLOGY · GROWTH</span>
        </div>
        <div className={styles.heroContent}>
          <h1 id="services-title">One team.<br />Every digital <em>advantage.</em></h1>
          <p>We connect software, web, brand, content, and performance marketing—so every part of your digital presence moves toward the same business goal.</p>
        </div>
        <div className={styles.heroCue}><span>↓</span> EXPLORE CAPABILITIES</div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div>SOFTWARE <i>＋</i> WEBSITES <i>＋</i> MARKETING <i>＋</i> BRAND <i>＋</i> AUTOMATION <i>＋</i> SOFTWARE <i>＋</i> WEBSITES <i>＋</i></div>
      </div>

      <section className={styles.services} aria-label="Service capabilities">
        <header className={`${styles.sectionHeader} ${styles.reveal}`}>
          <p>WHAT WE DO / 04 CAPABILITIES</p>
          <h2>Built together.<br /><em>Better together.</em></h2>
          <span>Engage us for one focused challenge or bring us the complete growth objective. We assemble the right senior team around the outcome.</span>
        </header>

        <div className={styles.serviceList}>
          {services.map((service) => (
            <article className={`${styles.servicePanel} ${styles.reveal}`} key={service.number}>
              <div className={styles.panelGlow} aria-hidden="true" />
              <div className={styles.panelTop}>
                <span>{service.number}</span>
                <p>{service.label}</p>
                <div className={`${styles.motif} ${styles[service.motif]}`} aria-hidden="true"><i /><i /><i /><b /></div>
              </div>
              <div className={styles.panelBody}>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </div>
              <div className={styles.panelFooter}>
                <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <a href="/contact" aria-label={`Discuss ${service.title}`}>START A PROJECT <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <div className={`${styles.processHeading} ${styles.reveal}`}>
          <p>HOW WE WORK</p>
          <h2 id="process-title">From first question<br />to <em>lasting impact.</em></h2>
        </div>
        <div className={styles.timeline}>
          <div className={styles.timelineLine} aria-hidden="true"><i /></div>
          {process.map(([number, title, copy], index) => (
            <article className={`${styles.processStep} ${styles.reveal}`} style={{ transitionDelay: `${index * 90}ms` }} key={number}>
              <span>{number}</span><b aria-hidden="true" />
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <p>YOUR NEXT MOVE</p>
        <h2>Bring us the challenge.<br /><em>We’ll build the advantage.</em></h2>
        <a href="/contact">TALK TO OUR TEAM <span>↗</span></a>
      </section>
    </div>
  );
}
