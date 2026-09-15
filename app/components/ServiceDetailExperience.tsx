"use client";

import { useEffect, useRef } from "react";
import ContactForm from "../contact/ContactForm";
import styles from "./CustomSoftwareExperience.module.css";

export type ServiceDetail = {
  number: string; title: string; chapterMarker: string; kicker: string; hero: [string, string]; intro: string;
  nodes: string[]; marquee: string[]; fitTitle: [string, string]; fitCopy: string;
  outcomes: [string, string, string][]; sectionLabel: string; sectionTitle: [string, string];
  capabilities: [string, string, string][]; processIntro: string;
  process: [string, string, string][]; stackLabel: string; stackTitle: [string, string]; stack: string[];
  contactKicker: string; contactTitle: [string, string]; contactCopy: string;
};

export default function ServiceDetailExperience({ detail }: { detail: ServiceDetail }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible)), { threshold: .12, rootMargin: "0px 0px -7%" });
    items.forEach((item) => observer.observe(item));
    const move = (event: PointerEvent) => { root.style.setProperty("--pointer-x", (event.clientX / innerWidth - .5).toFixed(3)); root.style.setProperty("--pointer-y", (event.clientY / innerHeight - .5).toFixed(3)); };
    const scroll = () => root.style.setProperty("--scroll-progress", Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
    addEventListener("pointermove", move, { passive: true }); addEventListener("scroll", scroll, { passive: true }); scroll();
    return () => { observer.disconnect(); removeEventListener("pointermove", move); removeEventListener("scroll", scroll); };
  }, []);
  const rail = [...detail.marquee, ...detail.marquee];
  return <div ref={rootRef} className={styles.experience}>
    <section className={styles.hero} aria-labelledby={`service-${detail.number}`}>
      <div className={styles.grid} aria-hidden="true" /><div className={styles.heroTop}><p>ASSISTMYDAY / SERVICES / {detail.number}</p><span>{detail.title.toUpperCase()}</span></div>
      <div className={styles.systemMap} aria-hidden="true"><span className={styles.core} />{detail.nodes.map((node, index) => <i className={[styles.nodeOne,styles.nodeTwo,styles.nodeThree,styles.nodeFour][index]} key={node}>{node}</i>)}</div>
      <div className={styles.heroContent}><div><small>{detail.kicker}</small><h1 id={`service-${detail.number}`}>{detail.hero[0]}<br /><em>{detail.hero[1]}</em></h1></div><div className={styles.heroIntro}><p>{detail.intro}</p><a href="#service-contact">DISCUSS YOUR PROJECT <span>↗</span></a></div></div>
      <div className={styles.scrollCue}><span>↓</span> EXPLORE THE SERVICE</div>
    </section>
    <div className={styles.marquee} aria-hidden="true"><div>{rail.map((item,index)=><span key={`${item}-${index}`}>{item} <i>✦</i> </span>)}</div></div>
    <section className={styles.intro} data-section-marker={detail.chapterMarker}><p className={styles.eyebrow}>THE RIGHT FIT</p><div className={`${styles.introCopy} ${styles.reveal}`}><h2>{detail.fitTitle[0]}<br /><em>{detail.fitTitle[1]}</em></h2><p>{detail.fitCopy}</p></div><div className={`${styles.outcomes} ${styles.reveal}`}>{detail.outcomes.map(([label,text,value],index)=><article key={label}><strong>0{index+1}</strong><span>{label}</span><p>{text}</p><b>{value}</b></article>)}</div></section>
    <section className={styles.capabilitySection}><header className={`${styles.sectionHeader} ${styles.reveal}`}><p>{detail.sectionLabel}</p><h2>{detail.sectionTitle[0]}<br /><em>{detail.sectionTitle[1]}</em></h2></header><div className={styles.capabilities}>{detail.capabilities.map(([number,title,copy],index)=><article className={`${styles.capability} ${styles.reveal}`} style={{transitionDelay:`${index*70}ms`}} key={number}><div><span>{number}</span><b>↗</b></div><div className={styles.capabilityGraphic} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className={styles.processSection}><header className={`${styles.processHeader} ${styles.reveal}`}><p>HOW WE DELIVER</p><h2>Clear milestones.<br /><em>Visible progress.</em></h2><span>{detail.processIntro}</span></header><div className={styles.process}>{detail.process.map(([number,title,copy])=><article className={styles.reveal} key={number}><span>{number}</span><div className={styles.dot}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className={styles.stackSection}><div className={`${styles.stackIntro} ${styles.reveal}`}><p>{detail.stackLabel}</p><h2>{detail.stackTitle[0]}<br /><em>{detail.stackTitle[1]}</em></h2></div><div className={styles.stack}>{detail.stack.map((item,index)=><span className={styles.reveal} style={{transitionDelay:`${index%4*60}ms`}} key={item}><small>{String(index+1).padStart(2,"0")}</small>{item}</span>)}</div></section>
    <section id="service-contact" className={styles.contactSection}><div className={`${styles.contactIntro} ${styles.reveal}`}><p>{detail.contactKicker}</p><h2>{detail.contactTitle[0]}<br /><em>{detail.contactTitle[1]}</em></h2><span>{detail.contactCopy}</span><div><a href="mailto:info@assistmyday.com">info@assistmyday.com</a><a href="tel:+19053748878">+1 (905) 374-8878</a></div></div><div className={`${styles.contactFormWrap} ${styles.reveal}`}><ContactForm/></div></section>
  </div>;
}
