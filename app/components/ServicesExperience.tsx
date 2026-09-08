"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ServiceItem } from "../../lib/content-types";
import styles from "./ServicesExperience.module.css";



const process = [
  ["01", "Discover", "We clarify the challenge, audience, operational context, and success measures."],
  ["02", "Define", "We turn the opportunity into a practical roadmap, scope, and delivery plan."],
  ["03", "Build", "We design, develop, launch, and measure with one accountable senior team."],
  ["04", "Grow", "We optimize performance, expand capabilities, and improve results over time."],
] as const;

const technologyStack = [
  ["01", "AI & Automation", ["OpenAI integrations", "AI assistants", "n8n workflows", "Intelligent search"]],
  ["02", "Front-end", ["React", "Next.js", "TypeScript", "GSAP & WebGL"]],
  ["03", "Back-end", ["Node.js", "APIs", "Authentication", "Business logic"]],
  ["04", "Data & CMS", ["MySQL", "MongoDB", "WordPress", "Headless CMS"]],
  ["05", "Commerce", ["Shopify", "WooCommerce", "Payments", "Conversion systems"]],
  ["06", "Cloud & DevOps", ["AWS", "Cloudflare", "GitHub Actions", "Managed deployment"]],
  ["07", "Growth Stack", ["SEO", "Paid media", "Analytics", "CRM automation"]],
] as const;

const serviceVisuals = [
  "/services/service-software-ai.png",
  "/services/service-websites.png",
  "/services/service-marketing.png",
  "/services/service-creative.png",
] as const;

export default function ServicesExperience({ services }: { services: ServiceItem[] }) {
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
    let renderedProgress: number | undefined;
    let previousFrameTime = performance.now();
    const updateProgress = (frameTime: number) => {
      const elapsed = Math.min(40, Math.max(1, frameTime - previousFrameTime));
      previousFrameTime = frameTime;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, root.offsetHeight - window.innerHeight);
      const target = Math.min(1, Math.max(0, -rect.top / total));
      panels.forEach((panel) => {
        const panelRect = panel.getBoundingClientRect();
        const panelProgress = Math.min(1, Math.max(0, (window.innerHeight - panelRect.top) / (window.innerHeight + panelRect.height)));
        panel.style.setProperty("--panel-progress", panelProgress.toFixed(4));
      });
      const smoothing = 1 - Math.exp(-elapsed / 110);
      const previous = renderedProgress ?? target;
      const next = previous + (target - previous) * smoothing;
      renderedProgress = Math.abs(target - next) < 0.0002 ? target : next;
      root.style.setProperty("--page-progress", renderedProgress.toFixed(4));
      raf = renderedProgress === target ? 0 : requestAnimationFrame(updateProgress);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateProgress);
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

      <section className={styles.services} aria-label="Service capabilities">
        <header className={`${styles.sectionHeader} ${styles.reveal}`}>

          <h2>Built together.<br /><em>Better together.</em></h2>
          <span>Engage us for one focused challenge or bring us the complete growth objective. We assemble the right senior team around the outcome.</span>
        </header>

        <div className={styles.serviceList}>
          {services.map((service, index) => (
            <article className={`${styles.servicePanel} ${styles.reveal}`} style={{ zIndex: index + 1 }} key={service.number}>
              <div className={styles.panelGlow} aria-hidden="true" />
              <div className={styles.chapterNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.panelVisual}>
                <Image src={serviceVisuals[index % serviceVisuals.length]} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
                <span>{service.number}</span>
              </div>
              <div className={styles.panelContent}>
                <div className={styles.panelTop}>
                  <span>{service.number}</span>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.panelHeading}>
                    <h3>{service.title}</h3>
                    <div className={`${styles.motif} ${styles[service.motif]}`} aria-hidden="true"><i /><i /><i /><b /></div>
                  </div>
                  <p>{service.copy}</p>
                </div>
                <div className={styles.panelFooter}>
                  <div><p>OUR CORE CAPABILITIES</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <a href="/contact" aria-label={`Discuss ${service.title}`}>START A PROJECT <span>↗</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stack} aria-labelledby="stack-title">
        <header className={`${styles.stackHeader} ${styles.reveal}`}><h2 id="stack-title">✦ Technology Stack</h2><span>We choose proven technologies around the product, team, and growth objective—not trends for their own sake.</span></header>
        <div className={styles.stackGrid}>{technologyStack.map(([number, title, items], index) => <article className={styles.reveal} style={{ transitionDelay: `${(index % 3) * 70}ms` }} key={number}><small>{number}</small><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
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
