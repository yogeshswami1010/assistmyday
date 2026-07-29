"use client";

import { useEffect, useState } from "react";
import AxiomWebGL from "./components/AxiomWebGL";

const work = [
  { title: "Nexora AI", copy: "A platform simplifying work, decisions, and intelligent automation.", kind: "tower" },
  { title: "Echo Studio", copy: "A motion-led music platform showcasing artists, projects, and culture.", kind: "music" },
  { title: "Habitat", copy: "A seamless property platform for effortless discovery.", kind: "house" },
];

const services = [
  ["AI & Intelligent Automation", "Smarter systems that work quietly, learn quickly, and turn complexity into momentum."],
  ["Web Development", "High-performance digital experiences built for clarity, scale, and longevity."],
  ["Product Design", "Thoughtful products that earn attention, deepen engagement, and build lasting loyalty."],
  ["Branding", "Distinct identities that position ambitious businesses for relevance and growth."],
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
        <a href="#home" className="brand"><i />AXIOM<sup>®</sup></a>
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
        <p>INDEPENDENT DIGITAL STUDIO<br />INDIA — WORLDWIDE</p>
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
          <div className="hero-title"><h1>Designed to</h1><h1>mean <em>impact.</em></h1></div>
          <div className="hero-status">
            <div className="est"><span>◎</span><small>EST. 2012</small></div>
            <p>Websites, AI products, brands, and<br />systems built for clarity, scale and impact.</p>
          </div>
          <p className="blast">HOLD TO <b>✹</b> BLAST<br /><span>DRAG&nbsp; ⚡ &nbsp;TO ROTATE THE MARK.</span></p>
          <div className="hero-finale">
            <span>STRUCTURE</span><i>＋</i><span>SIGNAL</span><i>＋</i><span>IMPACT</span>
          </div>
        </div>
      </section>

      <section id="about" className="about scene-dark">
        <p className="micro left">ABOUT</p>
        <h2>Axiom is an independent digital<br />studio crafting meaningful brand<br />experiences through strategy, design,<br />and technology.</h2>
        <p className="about-mantra">WE DESIGN<br />FIRST. CRAFT<br />BUILT &nbsp;&nbsp; SCALE.</p>
        <div className="about-side">
          <p>Our mission is to make technology feel human by designing digital products that are intuitive, purposeful, and meaningful to people.</p>
          <a href="#facts">MORE ABOUT US <span>→</span></a>
        </div>
        <div className="fragment fragment-a" /><div className="fragment fragment-b" /><div className="fragment fragment-c" />
      </section>
      </div>

      <section className="mantra scene-dark" data-scrollscene>
        <div className="sticky">
          <p>FOCUSED VISION.<br />MEASURED EXECUTION.</p>
          <div className="mantra-track"><span>CREATE</span><b>＋</b><span>IMPACT</span><b>＋</b><span>INSPIRE</span></div>
          <div className="wipe-bars"><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <section id="facts" className="facts scene-light">
        <div className="facts-title"><h2>Key facts</h2><p>A snapshot of our<br />experience and impact.</p></div>
        <div className="cards">
          <article className="fact award">
            <small>FEATURED & AWARDS</small>
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
            <b className="w-dot">W.</b><strong>50+</strong>
            <p>Featured on top design<br />platforms worldwide.</p>
          </article>
          <article className="fact projects">
            <small>PROJECTS COMPLETED</small>
            <div className="count-circle">1.5K<sup>+</sup></div>
            <p>90% of our clients seek our<br />services for a second project.</p>
          </article>
          <article className="fact team">
            <small>OUR TEAM MEMBERS</small>
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
            <strong>20+</strong><p>Different skills.<br />One standard.</p>
          </article>
        </div>
        <div className="partners"><p>OUR BUSINESS PARTNERS</p><div><b>credible</b><b>Yellowtail</b><b>LUXURY<br />PRESENCE</b><b>TECHNIS</b><b>OCKTO</b></div></div>
      </section>

      <section id="work" className="work scene-light" data-scrollscene>
        <div className="sticky work-sticky">
          <div className="work-track">
            <div className="work-intro">
              <h2>Selected work<br />& explorations</h2>
              <a href="#services">VIEW ALL PROJECTS <span>→</span></a>
            </div>
            {work.map((item) => (
              <article className="work-card" key={item.title}>
                <div className={`project-visual ${item.kind}`}>
                  {item.kind === "tower" && <><div className="sun" /><div className="mega-tower" /><strong>Hi, I&apos;m Nova.</strong><small>POWER YOUR WORKFORCE<br />WITH DIGITAL WORKERS</small></>}
                  {item.kind === "music" && <><div className="red-beam" /><div className="artist">♩</div><strong>Independent sound.<br />Built to move culture.</strong></>}
                  {item.kind === "house" && <><div className="villa" /><strong>LIVE LIFE<br />IN LUXURY</strong><small>10K<br />LISTINGS</small></>}
                </div>
                <div className="work-meta"><div><h3>{item.title}</h3><p>{item.copy}</p></div><a href="#contact">EXPLORE PROJECT <span>→</span></a></div>
              </article>
            ))}
            <div className="work-outro"><h3>Discover our complete collection of digital experiences, brands, and platforms.</h3><a href="#services">VIEW ALL PROJECTS <span>→</span></a></div>
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
          <div className="service-words"><span>A.I.</span><span>DESIGN</span><span>DEVELOPMENT</span><span>BRANDING</span></div>
          <div className="stone"><i /><i /><i /></div>
          <div className="service-detail">
            {services.map((s, i) => <article key={s[0]} className={`detail-${i}`}><h3>{s[0]}</h3><p>{s[1]}</p></article>)}
          </div>
          <p className="discipline">✦ DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.</p>
          <a className="view-services" href="#stories">VIEW SERVICES <span>→</span></a>
        </div>
      </section>

      <section id="stories" className="stories scene-light">
        <div className="story-head"><h2>Client stories</h2><p>Great work is built through partnership. Here&apos;s what our clients say.</p></div>
        <div className="story-body">
          <nav><span>ARC STUDIO</span><b>VERDANT →</b><span>NORTH/ONE</span><span>CREATIVE UNIT</span><span>MONOCLE</span></nav>
          <div className="quote">
            <h3>“Axiom is extremely reliable, professional and talented. They turn complex ideas into digital work that feels beautifully simple.”</h3>
            <div className="person"><i>AM</i><p>Amelia Morgan<br /><span>Founder & CEO · USA</span></p></div>
          </div>
        </div>
        <div className="story-actions"><div><button>←</button><button>→</button></div><a href="#contact">BECOME A CLIENT <span>→</span></a></div>
      </section>

      <section className="motion-lab scene-light" data-scrollscene>
        <div className="sticky lab-sticky">
          <h2 className="design-in">DESIGN IN</h2><h2 className="motion-word">MOTION</h2>
          <p className="lab-center">EXPLORING IDEAS THROUGH<br />DAILY DESIGN PRACTICE.</p>
          <p className="lab-copy">Concepts, explorations, and interface<br />experiments shared openly as part of<br />our creative process.</p>
          <a href="#contact" className="lab-link">VIEW ON DRIBBBLE <span>→</span></a>
          <div className="floating-grid">
            {["editorial","fashion","culture","watch","future","pink"].map((n, i) => <div className={`lab-card ${n}`} key={n}><small>0{i + 1}</small><b>{n === "pink" ? "NOVAGLAM" : n === "future" ? "2026" : n.toUpperCase()}</b><i /></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="footer scene-dark">
        <p className="footer-kicker">LET&apos;S BUILD WORK THAT INSPIRES.</p>
        <h2>Ready to build<br />something bold?</h2>
        <a href="mailto:hello@axiom.studio" className="collab">START A COLLABORATION <span>→</span></a>
        <p className="copyright">©AXIOM® 2026</p>
        <div className="footer-info"><div><small>BUSINESS ENQUIRY</small><p>E. &nbsp;hello@axiom.studio<br />P. &nbsp;+91 98241 82099</p></div><div><small>SOCIAL</small><p>Linkedin&nbsp;&nbsp;&nbsp;&nbsp; Facebook<br />Dribbble&nbsp;&nbsp;&nbsp;&nbsp; Instagram</p></div></div>
        <p className="sound-line">SOUND ON ♫ HOVER THE LINES.</p>
        <div className="line-logo" aria-hidden="true">{[...Array(46)].map((_, i) => <i key={i} />)}</div>
      </section>
    </main>
  );
}
