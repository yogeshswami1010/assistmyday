"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AxiomWebGL from "./AxiomWebGL";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import type { PortfolioProject, ServiceItem } from "../../lib/content-types";

const work = [
  { title: "Custom Software Platforms", copy: "Purpose-built portals, dashboards, and workflow systems that simplify operations and support growth.", kind: "tower" },
  { title: "High-Performance Websites", copy: "Conversion-focused websites and commerce experiences engineered for speed, clarity, and measurable action.", kind: "music" },
  { title: "Growth Marketing Systems", copy: "Connected SEO, paid media, content, and analytics programs that turn attention into qualified demand.", kind: "house" },
];
const googleReviews = [
  { name: "greenbeecleaners", time: "A year ago", comment: "We sincerely appreciate your dedication to excellence and the positive impact you make. Your team consistently goes above and beyond, and we’re grateful for your willingness to take on extra responsibilities. Thank you for your efficiency and hard work—we truly appreciate it." },
  { name: "Griselda Gonsalves", time: "2 years ago", comment: "AssistMyDay excels in delivering great service, whether in web design or digital marketing solutions that redefine online presence. They have a knack for understanding client needs and translating them into compelling digital experiences." },
  { name: "VA Jose", time: "A year ago", comment: "Perfect and honest 100% service. Creativity conceptualized to reality in web design and publishing. Reasonable pricing." },
  { name: "Zoha Jamal", time: "2 years ago", comment: "Assist My Day is an excellent choice if you’re seeking website redesign or digital marketing solutions. The team is truly committed to delivering high-quality work and ensuring client satisfaction." },
  { name: "Sumitha VA", time: "A year ago", comment: "Always deliver outstanding results with their web development and SEO services. Fantastic team!" },
  { name: "Vishal Bangarh", time: "A year ago", comment: "Great work! Very hardworking and well-skilled team. Having great experience working with them. Special thanks to Kollins." },
];



export default function HomeExperience({ services, portfolio }: { services: ServiceItem[]; portfolio: PortfolioProject[] }) {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });  const [reviewPage, setReviewPage] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const updateReviewsPerPage = () => {
      setReviewsPerPage(media.matches ? 1 : 3);
      setReviewPage(0);
    };
    updateReviewsPerPage();
    media.addEventListener("change", updateReviewsPerPage);
    return () => media.removeEventListener("change", updateReviewsPerPage);
  }, []);

  const reviewPageCount = Math.ceil(googleReviews.length / reviewsPerPage);
  const visibleReviews = googleReviews.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage);

  useEffect(() => {
    let raf = 0;
    let renderedPageProgress: number | undefined;
    const renderedProgress = new Map<HTMLElement, number>();
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothing = reducedMotion ? 1 : 0.115;
    const render = () => {
      let keepAnimating = false;
      document.querySelectorAll<HTMLElement>("[data-scrollscene]").forEach((el) => {
        const span = Math.max(el.offsetHeight - innerHeight, 1);
        const target = Math.min(1, Math.max(0, (scrollY - el.offsetTop) / span));
        const previous = renderedProgress.get(el) ?? target;
        const next = previous + (target - previous) * smoothing;
        const progress = Math.abs(target - next) < 0.00025 ? target : next;
        renderedProgress.set(el, progress);
        el.style.setProperty("--p", String(progress));
        const workProgress = el.classList.contains("work")
          ? Math.min(1, Math.max(0, (progress - 0.14) / 0.86))
          : progress;
        el.style.setProperty("--workProgress", String(workProgress));
        el.style.setProperty("--shift", `${workProgress * -226}vw`);
        el.style.setProperty("--labShift", `${(progress - 0.5) * 110}vw`);
        if (el.classList.contains("motion-lab")) {
          const cards = el.querySelectorAll<HTMLElement>(".portfolio-lab-card");
          const mobile = innerWidth <= 760;
          const columns = mobile ? 2 : 3;
          const gap = mobile ? 10 : 18;
          const cardWidth = mobile
            ? innerWidth * 0.43
            : Math.min(350, Math.max(250, innerWidth * 0.24));
          const cardHeight = mobile
            ? innerWidth * 0.25
            : cardWidth * 0.56;
          const rows = Math.ceil(cards.length / columns);
          const gridWidth = columns * cardWidth + (columns - 1) * gap;
          const gridHeight = rows * cardHeight + (rows - 1) * gap;
          const gridStartX = (innerWidth - gridWidth) / 2;
          const gridStartY = (innerHeight - gridHeight) / 2;
          const trainPhase = Math.min(1, Math.max(0, progress / 0.28));
          const trainOffset = -0.1 + trainPhase * 0.24;
          const rawAssemble = Math.min(1, Math.max(0, (progress - 0.28) / 0.32));
          const assemble = 1 - Math.pow(1 - rawAssemble, 3);

          cards.forEach((card, index) => {
            const spacing = cards.length > 1 ? index / (cards.length - 1) : 0;
            const pathT = spacing * 0.88 + trainOffset;
            const inverseT = 1 - pathT;
            const p0x = innerWidth * -0.2;
            const p0y = innerHeight * 1.08;
            const p1x = innerWidth * 0.03;
            const p1y = innerHeight * -0.26;
            const p2x = innerWidth * 1.16;
            const p2y = innerHeight * 0.06;
            const trainCenterX = inverseT * inverseT * p0x + 2 * inverseT * pathT * p1x + pathT * pathT * p2x;
            const trainCenterY = inverseT * inverseT * p0y + 2 * inverseT * pathT * p1y + pathT * pathT * p2y;
            const visibleT = Math.min(1, Math.max(0, pathT));
            const trainX = trainCenterX - cardWidth / 2;
            const trainY = trainCenterY - cardHeight / 2;
            const trainScale = mobile ? 1.1 - visibleT * 0.3 : 1.35 - visibleT * 0.65;
            const trainRotation = 10 - visibleT * 18;
            const trainTilt = mobile ? 8 - visibleT * 12 : 13 - visibleT * 20;
            const trainZ = mobile ? 90 - visibleT * 150 : 240 - visibleT * 330;
            const column = index % columns;
            const row = Math.floor(index / columns);
            const rowCount = Math.min(columns, cards.length - row * columns);
            const rowOffset = (columns - rowCount) * (cardWidth + gap) / 2;
            const endX = gridStartX + rowOffset + column * (cardWidth + gap);
            const endY = gridStartY + row * (cardHeight + gap);
            const x = trainX + (endX - trainX) * assemble;
            const y = trainY + (endY - trainY) * assemble;
            const scale = trainScale + (1 - trainScale) * assemble;
            const rotation = trainRotation * (1 - assemble);
            const tilt = trainTilt * (1 - assemble);
            const z = trainZ * (1 - assemble);

            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.zIndex = String(cards.length - index);
            card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${tilt}deg) rotateZ(${rotation}deg) scale(${scale})`;
          });
        }
        if (progress !== target) keepAnimating = true;
      });
      const targetPageProgress = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      const previousPageProgress = renderedPageProgress ?? targetPageProgress;
      const nextPageProgress = previousPageProgress + (targetPageProgress - previousPageProgress) * smoothing;
      renderedPageProgress = Math.abs(targetPageProgress - nextPageProgress) < 0.00025
        ? targetPageProgress
        : nextPageProgress;
      document.documentElement.style.setProperty("--pageProgress", String(renderedPageProgress));
      if (renderedPageProgress !== targetPageProgress) keepAnimating = true;
      raf = keepAnimating ? requestAnimationFrame(render) : 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    render();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    addEventListener("mousemove", onMove);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main>
      <div className="cursor-dot" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }} />
      <div className="page-progress" />

      <SiteHeader active="HOME" />

      <div className="hero-about scene-dark">
        <div className="hero-canvas-shell">
          <AxiomWebGL />
        </div>

      <section id="home" className="hero scene-dark" data-hero-scroll>
        <div className="hero-sticky">
          <div className="grain" />
          <div className="hero-3d">
            <div className="hero-3d-glow" />
            <div className="hero-scanlines" />
          </div>
          <div className="hero-lines"><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="hero-title"><h1>Software that scales.</h1><h1>Marketing that <em>converts.</em></h1></div>
          <div className="hero-status">
            <div className="est"><span>◎</span><small>ST. CATHARINES</small></div>
            <p>Custom software, high-performance websites, and<br />full-funnel digital marketing built around your growth.</p>
          </div>
          <p className="drag-hint">DRAG TO ROTATE</p>
          <div className="hero-finale">
            <span>STRATEGY</span><i>＋</i><span>SOFTWARE</span><i>＋</i><span>GROWTH</span>
          </div>
        </div>
      </section>

      <section id="about" className="about scene-dark">
        <p className="micro left">ABOUT</p>
        <h2>We build digital products and<br />growth engines that help ambitious<br />companies operate smarter, reach<br />further, and scale with confidence.</h2>
        <p className="about-mantra">CODE.<br />CAMPAIGNS.<br />RESULTS.</p>
        <div className="about-side">
          <p>From product strategy and UX to software engineering, SEO, paid media, and content, our integrated team connects every part of your digital growth journey.</p>
          <a href="#facts">HOW WE WORK <span>→</span></a>
        </div>
        <div className="fragment fragment-a" /><div className="fragment fragment-b" /><div className="fragment fragment-c" />
      </section>
      </div>

      <section className="mantra scene-dark" data-scrollscene>
        <div className="sticky">
          <p>ONE PARTNER.<br />FROM IDEA TO IMPACT.</p>
          <div className="mantra-track"><span>DISCOVER</span><b>＋</b><span>BUILD</span><b>＋</b><span>SCALE</span></div>
          <div className="wipe-bars"><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <section id="facts" className="facts scene-light">
        <div className="facts-title"><h2>One team.<br />Every digital layer.</h2><p>Strategy to launch.<br />Traffic to revenue.</p></div>
        <div className="cards">
          <article className="fact award">
            <small>FULL-FUNNEL GROWTH</small>
            <video
              className="fact-video fact-video-loop"
              src="/awards-card-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Featured and awards presentation"
            />
            <b className="w-dot">A.</b><strong>360°</strong>
            <p>Brand, content, search, paid media,<br />conversion, and analytics.</p>
          </article>
          <article className="fact projects">
            <small>CONNECTED CAPABILITIES</small>
            <div className="count-circle">08<sup>+</sup></div>
            <p>Product, engineering, marketing,<br />creative, and optimization.</p>
          </article>
          <article className="fact team">
            <small>DELIVERY MODEL</small>
            <video
              className="fact-video fact-video-hover"
              src="/rushi.mp4"
              muted
              playsInline
              preload="auto"
              tabIndex={0}
              aria-label="Team presentation. Hover, focus, or tap to play."
              onMouseEnter={(event) => { void event.currentTarget.play(); }}
              onMouseLeave={(event) => {
                event.currentTarget.pause();
                event.currentTarget.currentTime = 0;
              }}
              onFocus={(event) => { void event.currentTarget.play(); }}
              onBlur={(event) => {
                event.currentTarget.pause();
                event.currentTarget.currentTime = 0;
              }}
              onClick={(event) => {
                if (event.currentTarget.paused) void event.currentTarget.play();
                else event.currentTarget.pause();
              }}
            />
            <strong>AGILE</strong><p>Senior thinking, clear milestones,<br />and continuous improvement.</p>
          </article>
        </div>
        <div className="partners"><p>WHAT WE BUILD</p><div><b>WEBSITES</b><b>WEB APPS</b><b>AUTOMATION</b><b>ECOMMERCE</b><b>CAMPAIGNS</b></div></div>
      </section>

      <section id="work" className="work scene-light" data-scrollscene>
        <div className="sticky work-sticky">
          <div className="work-track">
            <div className="work-intro">
              <h2>Digital systems built<br />for momentum</h2>
              <a href="/services">EXPLORE SERVICES <span>→</span></a>
            </div>
            {work.map((item) => (
              <article className="work-card" key={item.title}>
                <div className={`project-visual ${item.kind}`}>
                  {item.kind === "tower" && <><div className="sun" /><div className="mega-tower" /><strong>Work smarter.</strong><small>SOFTWARE<br />PLATFORMS</small></>}
                  {item.kind === "music" && <><div className="red-beam" /><div className="artist">↗</div><strong>Fast journeys.<br />More action.</strong></>}
                  {item.kind === "house" && <><div className="villa" /><strong>BE FOUND.<br />BE CHOSEN.</strong><small>GROWTH<br />MARKETING</small></>}
                </div>
                <div className="work-meta"><div><h3>{item.title}</h3><p>{item.copy}</p></div><a href="/contact">START A PROJECT <span>→</span></a></div>
              </article>
            ))}
            <div className="work-outro"><h3>From a first campaign to a business-critical platform, we create the digital foundation for your next stage of growth.</h3><a href="/services">VIEW SERVICES <span>→</span></a></div>
          </div>
        </div>
      </section>

      <section id="services" className="services scene-dark" data-scrollscene>
        <div className="sticky service-sticky">
          <video
            className="services-bg-video"
            src="/homepage-services-video_m.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="services-bg-overlay" />
          <div className="smoke smoke-one" /><div className="smoke smoke-two" />
          <p className="micro service-label">OUR SERVICES</p>
          <div className="service-words"><span>SOFTWARE</span><span>WEBSITES</span><span>MARKETING</span><span>CREATIVE</span></div>
          <div className="stone"><i /><i /><i /></div>
          <div className="service-detail">
            {services.slice(0, 4).map((s, i) => (
              <article key={s.id || s.title} className={`detail-${i}`}>
                <h3>{s.title}</h3>
                <i className="service-card-mark" aria-hidden="true" />
                <p>{s.copy}</p>
              </article>
            ))}
          </div>
          <p className="discipline">✦ STRATEGY, DESIGN, ENGINEERING, AND GROWTH. ONE TEAM.</p>
          <a className="view-services" href="/services">VIEW SERVICES <span>→</span></a>
        </div>
      </section>

      <section id="stories" className="stories scene-light">
        <div className="story-head"><h2>Built for measurable growth</h2><p>Integrated teams, clear communication, and outcomes that move the business forward.</p></div>
        <div className="google-reviews">
          <div className="google-review-summary"><div className="google-review-brand"><span className="google-g">G</span><p><b>Google Reviews</b><small>Assist My Day · St. Catharines</small></p></div><div><strong>5.0</strong><span className="google-stars" aria-label="Five-star rating">★★★★★</span><small>14 reviews</small></div></div>
          <div className="google-review-grid" aria-live="polite">
            {visibleReviews.map((review, index) => (
              <article className="google-review-card" key={`${review.name}-${reviewPage}`} style={{ animationDelay: `${index * 90}ms` }}>
                <header><span className="review-avatar">{review.name.charAt(0).toUpperCase()}</span><div><h3>{review.name}</h3><small>{review.time}</small></div><b>G</b></header>
                <div className="google-stars" aria-label="Five-star review">★★★★★</div>
                <p>{review.comment}</p>
                <a href="https://share.google/VgwmytGzUI3oucbiI" target="_blank" rel="noopener noreferrer">VIEW ON GOOGLE <span>↗</span></a>
              </article>
            ))}
          </div>
          <div className="google-review-controls"><div><button type="button" onClick={() => setReviewPage((page) => (page - 1 + reviewPageCount) % reviewPageCount)} aria-label="Show previous reviews">←</button><button type="button" onClick={() => setReviewPage((page) => (page + 1) % reviewPageCount)} aria-label="Show next reviews">→</button></div><span>{String(reviewPage + 1).padStart(2, "0")} / {String(reviewPageCount).padStart(2, "0")}</span><a href="https://share.google/VgwmytGzUI3oucbiI" target="_blank" rel="noopener noreferrer">READ ALL GOOGLE REVIEWS <b>↗</b></a></div>
        </div>
      </section>

      <section id="portfolio" className="motion-lab scene-light" data-scrollscene>
        <div className="sticky lab-sticky">
          <h2 className="design-in">DIGITAL</h2><h2 className="motion-word">DELIVERED</h2>
          <p className="lab-center">SELECTED SOFTWARE AND MARKETING WORK<br />FOR AMBITIOUS BUSINESSES.</p>
          <p className="lab-copy">Software, web platforms, strategy,<br />creative, campaigns, and growth.</p>
          <a href="/contact" className="lab-link">TALK TO OUR TEAM <span>→</span></a>
          <div className="floating-grid portfolio-lab-grid">
            {portfolio.map((project, index) => (
              <article className="lab-card portfolio-lab-card" key={`${project.title}-${index}`}>
                <Image
                  src={project.image}
                  alt={`${project.title} website project`}
                  width={1904}
                  height={870}
                  unoptimized
                  sizes="(max-width: 760px) 76vw, 25vw"
                />
                <div className="portfolio-lab-caption">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <b>{project.title}</b>
                  <span>{project.category}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="portfolio-transition-wipe" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <SiteFooter id="contact" topHref="#home" />
    </main>
  );
}
