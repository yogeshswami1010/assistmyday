"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PortfolioProject } from "../../lib/content-types";
import styles from "./PortfolioExperience.module.css";



const flightPaths = [
  [-43, -35, -8, -64, -12], [41, -31, 16, -58, 11], [-33, 9, -58, -5, -7], [38, 15, 61, 4, 9],
  [-45, 36, -72, 50, 8], [43, 39, 76, 58, -10], [-12, -41, -28, -71, 5], [13, 40, 26, 73, -6],
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function PortfolioExperience({ projects }: { projects: PortfolioProject[] }) {
  const stageRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!stage || !pin || !canvas) return;

    const floatingCards = Array.from(pin.querySelectorAll<HTMLElement>(`.${styles.floatCard}`));
    const title = pin.querySelector<HTMLElement>(`.${styles.heroTitle}`);
    const mark = pin.querySelector<HTMLElement>(`.${styles.heroMark}`);
    const scrollCue = pin.querySelector<HTMLElement>(`.${styles.scrollCue}`);
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(pin.clientWidth * ratio);
      canvas.height = Math.round(pin.clientHeight * ratio);
      canvas.style.width = `${pin.clientWidth}px`;
      canvas.style.height = `${pin.clientHeight}px`;
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawLines = (progress: number) => {
      if (!ctx) return;
      const width = pin.clientWidth;
      const height = pin.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.8;
      for (let index = 0; index < 9; index += 1) {
        const offset = index * 0.12;
        const drift = (progress + offset) * width * 0.2;
        ctx.beginPath();
        ctx.strokeStyle = index % 3 === 0 ? "rgba(91,184,232,.28)" : "rgba(102,108,235,.12)";
        ctx.moveTo(-width * 0.08 + drift, height * (0.14 + index * 0.1));
        ctx.lineTo(width * (0.58 + index * 0.07) + drift, height * (0.02 + index * 0.065));
        ctx.stroke();
      }
      for (let index = 0; index < 24; index += 1) {
        const x = ((index * 173 + progress * 580) % (width + 80)) - 40;
        const y = (index * 97) % height;
        ctx.fillStyle = index % 4 === 0 ? "rgba(91,184,232,.7)" : "rgba(255,255,255,.28)";
        ctx.fillRect(x, y, index % 4 === 0 ? 2 : 1, index % 4 === 0 ? 2 : 1);
      }
    };

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const distance = Math.max(1, stage.offsetHeight - pin.offsetHeight);
      const progress = clamp(-rect.top / distance);
      const ease = 1 - Math.pow(1 - progress, 3);

      floatingCards.forEach((card, index) => {
        const [startX, startY, endX, endY, rotation] = flightPaths[index % flightPaths.length];
        const x = startX + (endX - startX) * ease + mouseX * (index % 2 ? -0.8 : 0.8);
        const y = startY + (endY - startY) * ease + mouseY * (index % 3 ? 0.55 : -0.55);
        const scale = 0.72 + ease * 0.5;
        const opacity = clamp(0.25 + progress * 1.6 - Math.max(0, progress - 0.72) * 3.4);
        card.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${rotation + progress * rotation * 1.8}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
      });

      if (title) {
        title.style.transform = `translate3d(0, ${progress * -10}vh, 0) scale(${1 + progress * 0.18})`;
        title.style.opacity = String(clamp(1 - progress * 1.5));
      }
      if (mark) {
        mark.style.transform = `translate3d(0, ${progress * 9}vh, 0) rotate(${progress * 135}deg) scale(${1 - progress * 0.25})`;
        mark.style.opacity = String(clamp(1 - progress * 1.2));
      }
      if (scrollCue) scrollCue.style.opacity = String(clamp(0.62 - progress * 2));
      drawLines(progress);
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onPointerMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 3.2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 3.2;
      requestUpdate();
    };

    resizeCanvas();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add(styles.visible)),
      { threshold: 0.16, rootMargin: "0px 0px -8%" },
    );
    document.querySelectorAll(`.${styles.projectCard}`).forEach((card) => observer.observe(card));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className={styles.experience}>
      <section ref={stageRef} className={styles.heroStage} aria-labelledby="portfolio-title">
        <div ref={pinRef} className={styles.heroPin}>
          <canvas ref={canvasRef} className={styles.lineCanvas} aria-hidden="true" />
          <div className={styles.floatLayer} aria-hidden="true">
            {projects.map((project, index) => (
              <div className={styles.floatCard} key={project.title} style={{ animationDelay: `${index * 90}ms` }}>
                <Image src={project.image} alt="" width={475} height={218} unoptimized />
              </div>
            ))}
          </div>

          <div className={styles.heroMark} aria-hidden="true">
            <span /><span /><span /><i />
          </div>
          <div className={styles.heroCopy}>
            <p>ASSISTMYDAY / SELECTED PROJECTS</p>
            <h1 id="portfolio-title" className={styles.heroTitle}>OUR <em>WORK</em></h1>
            <span>A curated showcase of websites, digital products, brands, and growth experiences.</span>
          </div>
          <div className={styles.scrollCue}><i>↓</i> SCROLL TO EXPLORE</div>
        </div>
      </section>

      <section className={styles.projects} aria-label="Selected projects">
        <header className={styles.projectsHeader}>
          <div className={styles.projectsIntro}>
            <p>SELECTED WORK / 2026</p>
            <span>Strategy, design, software, and marketing—connected from first idea to measurable impact.</span>
          </div>
          <h2>SELECTED <em>PROJECTS.</em></h2>
        </header>

        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <article className={`${styles.projectCard} ${styles[project.size]} ${styles[project.side]}`} key={project.title}>
              <a className={styles.projectImage} href={project.projectUrl || "/contact"} aria-label={`View ${project.title}`}>
                <Image src={project.image} alt={`${project.title} website`} width={1904} height={870} unoptimized />
                <span>VIEW PROJECT ↗</span>
              </a>
              <div className={styles.projectMeta}>
                <div><h3>{project.title}</h3><p>{project.category}</p></div>
                <small>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.outro}>
        <p>HAVE A PROJECT IN MIND?</p>
        <h2>Let’s make your next<br /><em>success story.</em></h2>
        <a href="/contact">START A PROJECT <span>↗</span></a>
      </section>
    </div>
  );
}
