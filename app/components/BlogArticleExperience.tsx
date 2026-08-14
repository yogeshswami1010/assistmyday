"use client";

import { useEffect, useRef } from "react";
import type { BlogArticle } from "../blog/articles";
import styles from "./BlogArticleExperience.module.css";

export default function BlogArticleExperience({ article, related }: { article: BlogArticle; related: BlogArticle[] }) {
  const articleRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = articleRef.current;
    const progress = progressRef.current;
    if (!root || !progress) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      const value = Math.min(1, Math.max(0, -rect.top / distance));
      progress.style.transform = `scaleX(${value})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = root.querySelectorAll<HTMLElement>(`.${styles.contentSection}`);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible)),
      { threshold: 0.12, rootMargin: "0px 0px -10%" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article ref={articleRef} className={styles.article} style={{ "--accent": article.accent } as React.CSSProperties}>
      <div className={styles.readingProgress} aria-hidden="true"><div ref={progressRef} /></div>
      <header className={styles.hero}>
        <div className={styles.heroNoise} aria-hidden="true" />
        <div className={styles.heroMeta}><a href="/blog">← ALL INSIGHTS</a><span>{article.category}</span><span>{article.date}</span><span>{article.readTime}</span></div>
        <h1>{article.title}</h1>
        <div className={styles.heroBottom}>
          <p>{article.excerpt}</p>
          <div className={styles.heroGraphic} aria-hidden="true"><i /><i /><i /><b /></div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.toc}>
          <p>IN THIS ARTICLE</p>
          <nav>{article.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><small>0{index + 1}</small>{section.heading}</a>)}</nav>
          <a className={styles.contactLink} href="/contact">DISCUSS THIS TOPIC <span>↗</span></a>
        </aside>
        <div className={styles.content}>
          <p className={styles.lead}>{article.intro}</p>
          {article.sections.map((section, index) => (
            <section id={`section-${index + 1}`} className={styles.contentSection} key={section.heading}>
              <span>0{index + 1}</span><h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}
          <blockquote>Clarity compounds. The strongest digital decisions connect customer value, operational reality, and a measurable next step.</blockquote>
          <div className={styles.author}><div>AMD</div><p><b>Assistmyday Strategy Team</b><span>Software, web, and digital growth specialists in St. Catharines, Ontario.</span></p></div>
        </div>
      </div>

      <section className={styles.related}>
        <header><p>CONTINUE READING</p><h2>Related <em>perspectives.</em></h2></header>
        <div>{related.map((item) => <a href={`/blog/${item.slug}`} key={item.slug}><small>{item.category}</small><h3>{item.title}</h3><span>READ ARTICLE ↗</span></a>)}</div>
      </section>
    </article>
  );
}
