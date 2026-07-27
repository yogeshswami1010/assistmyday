"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  { no: "01", title: "ORBITAL", kind: "AI PRODUCT / 2026", tone: "blue" },
  { no: "02", title: "KINETIC", kind: "IDENTITY / 2026", tone: "orange" },
  { no: "03", title: "MONOLITH", kind: "DIGITAL FLAGSHIP / 2025", tone: "silver" },
];

const services = ["A.I.", "DESIGN", "DEVELOPMENT", "BRANDING"];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1400, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{value}{suffix}</span>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [sound, setSound] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    const scroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max ? scrollY / max : 0);
    };
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.target.classList.toggle("in", entry.isIntersecting)),
      { threshold: 0.16 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    addEventListener("mousemove", move);
    addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      removeEventListener("mousemove", move);
      removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      <div className="cursor" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }} />
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <header>
        <a className="logo" href="#top" aria-label="Axiom home"><i />AXIOM<sup>®</sup></a>
        <div className="nav-actions">
          <button className="sound" onClick={() => setSound(!sound)} aria-label="Toggle ambient sound">
            {sound ? "◖))" : "◖×"}
          </button>
          <a className="pill light" href="#contact">LET&apos;S TALK</a>
          <button className="pill menu-btn" onClick={() => setMenu(!menu)} aria-expanded={menu}>
            MENU <b>{menu ? "×" : "＝"}</b>
          </button>
        </div>
      </header>

      <div className={`menu-panel ${menu ? "open" : ""}`}>
        <nav>
          {["WORK", "STUDIO", "SERVICES", "CONTACT"].map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)}>
              <small>0{i + 1}</small>{item}<span>↗</span>
            </a>
          ))}
        </nav>
        <p>INDEPENDENT DIGITAL STUDIO<br />INDIA — WORLDWIDE</p>
      </div>

      <section id="top" className="hero dark">
        <div className="noise" />
        <div className="orb orb-a" /><div className="orb orb-b" />
        <div className="hero-mark"><span>A</span></div>
        <div className="hero-copy">
          <p className="eyebrow">INDEPENDENT CREATIVE TECHNOLOGY STUDIO</p>
          <h1><span>Designed to</span><span>mean <em>impact.</em></span></h1>
        </div>
        <div className="hero-meta">
          <div className="stamp">◎<span>EST. 2012</span></div>
          <p>Digital products, brands, and systems<br />built for clarity, scale and impact.</p>
        </div>
        <p className="scroll-note">SCROLL TO EXPLORE <b>↓</b></p>
      </section>

      <section id="studio" className="intro light-section">
        <div className="section-label">01 / STUDIO</div>
        <h2 className="reveal">We turn ambitious ideas<br />into <i>unmistakable</i><br />digital experiences.</h2>
        <p className="intro-copy reveal">Axiom is an independent studio crafting meaningful brand experiences through strategy, design, and technology.</p>
        <div className="marquee" aria-hidden="true">
          <div>STRATEGY ✦ DESIGN ✦ TECHNOLOGY ✦ MOTION ✦ STRATEGY ✦ DESIGN ✦ TECHNOLOGY ✦ MOTION ✦</div>
        </div>
      </section>

      <section className="facts light-section">
        <div className="facts-head">
          <h3>Key facts</h3><p>A snapshot of our<br />experience and impact.</p>
        </div>
        <div className="fact-track">
          <article className="fact-card dark-card reveal">
            <span>FEATURED & AWARDED</span>
            <div className="award-object">✦</div>
            <strong><Counter to={50} suffix="+" /></strong>
            <p>Recognized by leading<br />design platforms worldwide.</p>
          </article>
          <article className="fact-card pale-card reveal">
            <span>PROJECTS COMPLETED</span>
            <div className="number-disc"><Counter to={1500} suffix="+" /></div>
            <p>90% of our partners return<br />for a second project.</p>
          </article>
          <article className="fact-card charcoal-card reveal">
            <span>ONE GLOBAL TEAM</span>
            <div className="team-face"><i /><i /></div>
            <strong><Counter to={20} suffix="+" /></strong>
            <p>Different skills.<br />One exacting standard.</p>
          </article>
        </div>
      </section>

      <section id="work" className="work dark">
        <div className="work-title reveal">
          <p>02 / SELECTED WORK</p>
          <h2>Built to move<br />brands <i>forward.</i></h2>
        </div>
        <div className="project-list">
          {projects.map(project => (
            <article className={`project ${project.tone}`} key={project.title}>
              <div className="project-art"><div className="shape" /><span>VIEW PROJECT ↗</span></div>
              <div className="project-info"><small>{project.no}</small><h3>{project.title}</h3><p>{project.kind}</p></div>
            </article>
          ))}
        </div>
        <a className="line-link" href="#contact">VIEW ALL PROJECTS <span>→</span></a>
      </section>

      <section id="services" className="services dark">
        <div className="smoke smoke-a" /><div className="smoke smoke-b" />
        <p className="section-label center">03 / OUR SERVICES</p>
        <div className="service-stack reveal">
          {services.map((service, i) => <div key={service} style={{ "--i": i } as React.CSSProperties}>{service}</div>)}
        </div>
        <p className="services-note">DIFFERENT DISCIPLINES.<br />ONE STANDARD OF CRAFT.</p>
        <a className="line-link service-link" href="#contact">VIEW SERVICES <span>→</span></a>
      </section>

      <section className="manifesto light-section">
        <p className="section-label">04 / HOW WE THINK</p>
        <h2 className="reveal">Not decoration.<br />Not noise.<br /><i>Design with intent.</i></h2>
        <div className="manifesto-grid">
          <p>We question the obvious, remove the unnecessary, and build what lasts.</p>
          <div className="spin-word">MOVE<br /><span>✳</span><br />MEAN</div>
        </div>
      </section>

      <section id="contact" className="contact dark">
        <div className="contact-orbit"><span>START A PROJECT • START A PROJECT • </span></div>
        <p>HAVE A BOLD IDEA?</p>
        <h2 className="reveal">Let&apos;s make it<br /><i>matter.</i></h2>
        <a href="mailto:hello@axiom.studio" className="contact-button">HELLO@AXIOM.STUDIO <b>↗</b></a>
        <footer>
          <a className="logo" href="#top"><i />AXIOM<sup>®</sup></a>
          <p>INDIA — WORKING WORLDWIDE<br />© 2026 AXIOM STUDIO</p>
          <div><a href="#">INSTAGRAM</a><a href="#">LINKEDIN</a><a href="#">DRIBBBLE</a></div>
        </footer>
      </section>
    </main>
  );
}
