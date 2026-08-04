"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AxiomWebGL from "./components/AxiomWebGL";

const work = [
  { title: "Transportation & Logistics", copy: "Digital systems that keep operations visible, responsive, and moving forward.", kind: "tower" },
  { title: "Trades & Services", copy: "Clear websites and campaigns designed to turn local demand into qualified leads.", kind: "music" },
  { title: "Real Estate", copy: "High-impact digital experiences that help properties and professionals stand out.", kind: "house" },
];

const services = [
  ["Website Development", "Fast, functional, SEO-ready websites and applications designed to convert and grow with your business."],
  ["Marketing & Sales", "Data-informed campaigns, audience targeting, and local growth strategies focused on measurable results."],
  ["Graphic Designing", "Professional logos, social graphics, website visuals, and marketing collateral that strengthen your identity."],
  ["Social Media", "Consistent content and channel management that builds visibility, engagement, and lasting customer relationships."],
];

const portfolio = [
  { title: "Signarama Brampton", category: "Web design & development", image: "/portfolio-signarama-home.webp" },
  { title: "Signarama Toronto", category: "Content-led business website", image: "/portfolio-signarama-about.webp" },
  { title: "Rio Immigration", category: "Immigration consultancy platform", image: "/portfolio-rio-immigration.webp" },
  { title: "Consortium Staffing", category: "Recruitment website", image: "/portfolio-consortium-staffing.webp" },
  { title: "The Burke Group", category: "Executive search experience", image: "/portfolio-burke-group.webp" },
  { title: "AMD Studios", category: "Photography studio website", image: "/portfolio-amd-studios.webp" },
  { title: "GeoSolar", category: "Sustainable energy website", image: "/portfolio-geosolar.webp" },
  { title: "Vishal Bangarh", category: "Real estate digital presence", image: "/portfolio-vishal-bangarh.webp" },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [sound, setSound] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });

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

      <header className="site-header">
        <a href="#home" className="brand" aria-label="Assistmyday home">
          <Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} priority unoptimized className="brand-logo" />
        </a>
        <div className="head-actions">
          <button className="sound" onClick={() => setSound(!sound)} aria-label="Toggle sound">{sound ? "◖))" : "◖×"}</button>
          <a href="#contact" className="talk">LET&apos;S TALK</a>
          <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu}>MENU <b>{menu ? "×" : "＝"}</b></button>
        </div>
      </header>

      <aside className={`menu-screen ${menu ? "is-open" : ""}`}>
        <nav>
          {["WORK", "ABOUT", "SERVICES", "CONTACT"].map((n, i) => (
            <a href={`#${n.toLowerCase()}`} onClick={() => setMenu(false)} key={n}><small>0{i + 1}</small><span>{n}</span><b>↗</b></a>
          ))}
        </nav>
        <p>DIGITAL GROWTH PARTNER<br />ST. CATHARINES — CANADA</p>
      </aside>

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
          <div className="hero-title"><h1>Flexible assistance.</h1><h1>Real <em>business growth.</em></h1></div>
          <div className="hero-status">
            <div className="est"><span>◎</span><small>ST. CATHARINES</small></div>
            <p>Website development, marketing, graphic design,<br />and social media support built around your goals.</p>
          </div>
          <p className="blast">HOLD TO <b>✹</b> BLAST<br /><span>DRAG&nbsp; ⚡ &nbsp;TO ROTATE THE MARK.</span></p>
          <div className="hero-finale">
            <span>CREATE</span><i>＋</i><span>CONNECT</span><i>＋</i><span>GROW</span>
          </div>
        </div>
      </section>

      <section id="about" className="about scene-dark">
        <p className="micro left">ABOUT</p>
        <h2>Your trusted partner in digital<br />marketing and business growth—<br />building tailored solutions around<br />your unique needs.</h2>
        <p className="about-mantra">YOUR TEAM.<br />YOUR GOALS.<br />OUR SUPPORT.</p>
        <div className="about-side">
          <p>Our team combines website development, innovative marketing strategies, graphic design, and social media management so you can focus on your core business while we drive your digital success.</p>
          <a href="#facts">MORE ABOUT US <span>→</span></a>
        </div>
        <div className="fragment fragment-a" /><div className="fragment fragment-b" /><div className="fragment fragment-c" />
      </section>
      </div>

      <section className="mantra scene-dark" data-scrollscene>
        <div className="sticky">
          <p>FLEXIBLE SUPPORT.<br />MEASURABLE GROWTH.</p>
          <div className="mantra-track"><span>BUILD</span><b>＋</b><span>MARKET</span><b>＋</b><span>GROW</span></div>
          <div className="wipe-bars"><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <section id="facts" className="facts scene-light">
        <div className="facts-title"><h2>Support that<br />moves business.</h2><p>Practical expertise.<br />Flexible partnership.</p></div>
        <div className="cards">
          <article className="fact award">
            <small>CLIENTS SUPPORTED</small>
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
            <b className="w-dot">A.</b><strong>15K+</strong>
            <p>Businesses supported<br />across global markets.</p>
          </article>
          <article className="fact projects">
            <small>CORE DIGITAL SERVICES</small>
            <div className="count-circle">04<sup>+</sup></div>
            <p>One connected team for your<br />complete digital presence.</p>
          </article>
          <article className="fact team">
            <small>LOCAL DIGITAL PARTNER</small>
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
            <strong>ON</strong><p>St. Catharines expertise.<br />Business-first thinking.</p>
          </article>
        </div>
        <div className="partners"><p>WHO WE SERVE</p><div><b>LOGISTICS</b><b>TRADES</b><b>REAL ESTATE</b><b>HEALTHCARE</b><b>RETAIL</b></div></div>
      </section>

      <section id="work" className="work scene-light" data-scrollscene>
        <div className="sticky work-sticky">
          <div className="work-track">
            <div className="work-intro">
              <h2>Industries we help<br />move forward</h2>
              <a href="#services">EXPLORE SERVICES <span>→</span></a>
            </div>
            {work.map((item) => (
              <article className="work-card" key={item.title}>
                <div className={`project-visual ${item.kind}`}>
                  {item.kind === "tower" && <><div className="sun" /><div className="mega-tower" /><strong>Move smarter.</strong><small>TRANSPORTATION<br />& LOGISTICS</small></>}
                  {item.kind === "music" && <><div className="red-beam" /><div className="artist">↗</div><strong>Local demand.<br />Real growth.</strong></>}
                  {item.kind === "house" && <><div className="villa" /><strong>BE SEEN.<br />BE CHOSEN.</strong><small>REAL ESTATE<br />GROWTH</small></>}
                </div>
                <div className="work-meta"><div><h3>{item.title}</h3><p>{item.copy}</p></div><a href="#contact">EXPLORE PROJECT <span>→</span></a></div>
              </article>
            ))}
            <div className="work-outro"><h3>From healthcare and finance to retail and fitness, we adapt our digital support to the way your industry works.</h3><a href="#services">VIEW SERVICES <span>→</span></a></div>
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
          <div className="service-words"><span>WEBSITES</span><span>MARKETING</span><span>DESIGN</span><span>SOCIAL</span></div>
          <div className="stone"><i /><i /><i /></div>
          <div className="service-detail">
            {services.map((s, i) => (
              <article key={s[0]} className={`detail-${i}`}>
                <h3>{s[0]}</h3>
                <i className="service-card-mark" aria-hidden="true" />
                <p>{s[1]}</p>
              </article>
            ))}
          </div>
          <p className="discipline">✦ FOUR CORE SERVICES. ONE FLEXIBLE PARTNER.</p>
          <a className="view-services" href="#stories">VIEW SERVICES <span>→</span></a>
        </div>
      </section>

      <section id="stories" className="stories scene-light">
        <div className="story-head"><h2>Client feedback</h2><p>Responsive support that gives clients more time to focus on what matters.</p></div>
        <div className="story-body">
          <nav><b>BUSINESS SUPPORT →</b><span>WEB DEVELOPMENT</span><span>MARKETING</span><span>GRAPHIC DESIGN</span><span>SOCIAL MEDIA</span></nav>
          <div className="quote">
            <h3>“AssistMyDay has completely changed my work-life balance. Their responsive and professional crew ensures that my chores are completed, allowing me to spend more time enjoying life outside of work.”</h3>
            <div className="person"><i>LJ</i><p>Lisa Johnson<br /><span>Assistmyday client</span></p></div>
          </div>
        </div>
        <div className="story-actions"><div><button>←</button><button>→</button></div><a href="#contact">BECOME A CLIENT <span>→</span></a></div>
      </section>

      <section className="motion-lab scene-light" data-scrollscene>
        <div className="sticky lab-sticky">
          <h2 className="design-in">YOUR DAY</h2><h2 className="motion-word">ASSISTED</h2>
          <p className="lab-center">SELECTED DIGITAL WORK FOR<br />AMBITIOUS BUSINESSES.</p>
          <p className="lab-copy">Web design, development, strategy,<br />marketing, and digital growth.</p>
          <a href="#contact" className="lab-link">TALK TO OUR TEAM <span>→</span></a>
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
        </div>
      </section>

      <section id="contact" className="footer scene-dark">
        <div className="footer-head">
          <p className="footer-kicker">LET&apos;S BUILD WORK THAT INSPIRES.</p>
          <a href="https://assistmyday.com/contact-us/" className="footer-mail">START A PROJECT <span>↗</span></a>
        </div>
        <div className="footer-hero">
          <h2>Ready to build<br /><em>something bold?</em></h2>
          <p className="footer-intro">Tell us what is slowing your business down. We&apos;ll shape a flexible digital solution around your team, audience, and goals.</p>
        </div>
        <div className="footer-meta">
          <div className="footer-brand-lockup"><Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} unoptimized className="footer-logo" /></div>
          <div className="footer-info">
            <div><small>CALL ANYTIME</small><p><a href="tel:+19053748878">+1 (905) 374-8878</a><br />St. Catharines, Ontario</p></div>
            <div><small>VISIT US</small><p>110 James St, Suite 411<br />St. Catharines, ON L2R 7E8</p></div>
          </div>
        </div>
        <div className="footer-base">
          <p className="copyright">© ASSISTMYDAY® 2026</p>
          <p>ST. CATHARINES — CANADA</p>
          <a href="#home">BACK TO TOP <span>↑</span></a>
        </div>
      </section>
    </main>
  );
}
