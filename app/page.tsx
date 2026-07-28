"use client";

import { useEffect, useRef, useState } from "react";

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
  const [logoActive, setLogoActive] = useState(false);
  const logoOrbitRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const orbitRef = useRef({ rx: -10, ry: -18, vx: 0, vy: 0, last: 0 });
  const blastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroPointerX = cursor.x < 0 || typeof window === "undefined" ? 0 : cursor.x / window.innerWidth - 0.5;
  const heroPointerY = cursor.y < 0 || typeof window === "undefined" ? 0 : cursor.y / window.innerHeight - 0.5;

  useEffect(() => {
    let raf = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const ease = (value: number) => {
      const t = clamp(value);
      return t * t * (3 - 2 * t);
    };
    const render = () => {
      document.querySelectorAll<HTMLElement>("[data-scrollscene]").forEach((el) => {
        const span = Math.max(el.offsetHeight - innerHeight, 1);
        const p = Math.min(1, Math.max(0, (scrollY - el.offsetTop) / span));
        el.style.setProperty("--p", String(p));
        el.style.setProperty("--shift", `${p * -226}vw`);
        el.style.setProperty("--labShift", `${(p - 0.5) * 110}vw`);
      });
      document.querySelectorAll<HTMLElement>("[data-hero-scroll]").forEach((hero) => {
        const span = Math.max(hero.offsetHeight - innerHeight, 1);
        const p = clamp((scrollY - hero.offsetTop) / span);
        const open = ease((p - 0.14) / 0.55);
        const pass = ease((p - 0.62) / 0.38);
        const copyOut = ease(p / 0.18);
        const worldFade = 1 - ease((p - 0.84) / 0.16);
        const pivot = p < 0.62 ? (p / 0.62) * 78 : 78 - pass * 40;

        hero.style.setProperty("--hero-p", String(p));
        hero.style.setProperty("--hero-copy-opacity", String(1 - copyOut));
        hero.style.setProperty("--hero-copy-y", `${copyOut * -54}px`);
        hero.style.setProperty("--hero-ui-opacity", String(1 - ease(p / 0.22)));
        hero.style.setProperty("--hero-world-opacity", String(worldFade));
        hero.style.setProperty("--hero-world-x", `${(p < 0.5 ? p * 9 : 4.5 - pass * 8)}vw`);
        hero.style.setProperty("--hero-world-y", `${2 + p * 7 - pass * 11}vh`);
        hero.style.setProperty("--hero-world-z", `${pass * 410}px`);
        hero.style.setProperty("--hero-world-ry", `${pivot}deg`);
        hero.style.setProperty("--hero-world-rz", `${-8 + p * 18}deg`);
        hero.style.setProperty("--hero-world-scale", String(0.88 + p * 0.2 + pass * 0.62));
        hero.style.setProperty("--hero-finale-opacity", String(ease((p - 0.76) / 0.16) * worldFade));

        const layers = hero.querySelectorAll<HTMLElement>("[data-a-layer]");
        layers.forEach((layer, index) => {
          const center = (layers.length - 1) / 2;
          const signed = index - center;
          const direction = signed === 0 ? 0.35 : Math.sign(signed);
          const x = signed * open * 31 + direction * pass * (96 + Math.abs(signed) * 15);
          const y = Math.sin(index * 1.7) * open * 17 + direction * pass * 34;
          const z = signed * 18 + signed * open * 84 + pass * (150 + Math.abs(signed) * 70);
          const rx = open * signed * 2.4 + pass * (index % 2 ? 18 : -14);
          const ry = open * signed * 4.2 + pass * direction * 25;
          const rz = open * signed * 1.2 + pass * (index % 2 ? 7 : -6);
          layer.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
          layer.style.opacity = String(worldFade * (0.5 + (1 - Math.abs(signed) / layers.length) * 0.5));
        });

        const shards = hero.querySelectorAll<HTMLElement>("[data-a-shard]");
        shards.forEach((shard, index) => {
          const angle = ((index * 137.5 + 18) * Math.PI) / 180;
          const radius = open * (62 + (index % 4) * 27) + pass * (260 + (index % 3) * 96);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.72;
          const z = open * ((index % 5) - 2) * 72 + pass * (210 + (index % 4) * 95);
          shard.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${p * (36 + index * 7)}deg) rotateY(${p * (52 + index * 11)}deg) rotateZ(${p * (18 + index * 9)}deg)`;
          shard.style.opacity = String((0.05 + open * 0.75) * worldFade);
        });
      });
      document.documentElement.style.setProperty("--pageProgress", String(scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1)));
      raf = 0;
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

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      const motion = orbitRef.current;
      const elapsed = Math.min(32, motion.last ? now - motion.last : 16);
      motion.last = now;

      if (!dragRef.current.active) {
        motion.ry += elapsed * 0.009 + motion.vy;
        motion.rx += (-10 + Math.sin(now * 0.00055) * 8 - motion.rx) * 0.025 + motion.vx;
        motion.vx *= 0.91;
        motion.vy *= 0.91;
      }

      logoOrbitRef.current?.style.setProperty("--orbit-rx", `${motion.rx}deg`);
      logoOrbitRef.current?.style.setProperty("--orbit-ry", `${motion.ry}deg`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
    };
  }, []);

  const startLogoDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    orbitRef.current.vx = 0;
    orbitRef.current.vy = 0;
    setLogoActive(true);
  };

  const moveLogoDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    orbitRef.current.ry += dx * 0.48;
    orbitRef.current.rx = Math.min(82, Math.max(-82, orbitRef.current.rx - dy * 0.42));
    orbitRef.current.vy = dx * 0.055;
    orbitRef.current.vx = -dy * 0.045;
  };

  const stopLogoDrag = () => {
    dragRef.current.active = false;
    if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
    blastTimerRef.current = setTimeout(() => setLogoActive(false), 450);
  };

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

      <section id="home" className="hero scene-dark" data-hero-scroll>
        <div className="hero-sticky">
          <div className="grain" />
          <div
            className="hero-3d"
            style={{
              "--hero-rx": `${heroPointerY * -4}deg`,
              "--hero-ry": `${heroPointerX * 6}deg`,
              "--hero-x": `${heroPointerX * 12}px`,
              "--hero-y": `${heroPointerY * 9}px`,
            } as React.CSSProperties}
          >
            <div className="hero-3d-glow" />
            <div
              className={`a-world ${logoActive ? "is-blasting" : ""}`}
              role="button"
              tabIndex={0}
              aria-label="Interactive 3D Axiom logo. Drag to rotate and hold to energize."
              onPointerDown={startLogoDrag}
              onPointerMove={moveLogoDrag}
              onPointerUp={stopLogoDrag}
              onPointerCancel={stopLogoDrag}
              onLostPointerCapture={stopLogoDrag}
              onClick={() => {
                if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
                setLogoActive(true);
                blastTimerRef.current = setTimeout(() => setLogoActive(false), 900);
              }}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
                  setLogoActive(true);
                }
              }}
              onKeyUp={(event) => {
                if (event.key === " " || event.key === "Enter") stopLogoDrag();
              }}
            >
              <div className="logo-orbit" ref={logoOrbitRef}>
                {[...Array(9)].map((_, index) => (
                  <div className="a-layer" data-a-layer key={index}>
                    <i className="a-segment a-left" />
                    <i className="a-segment a-right" />
                    <i className="a-segment a-bridge" />
                  </div>
                ))}
                <div className="a-shards">
                  {[...Array(14)].map((_, index) => <i data-a-shard key={index} />)}
                </div>
                <div className="energy-field">
                  <i className="thermal-glow" />
                  {[...Array(4)].map((_, arc) => (
                    <span className={`electric-arc arc-${arc + 1}`} key={arc}>
                      {[...Array(7)].map((__, spark) => <i key={spark} />)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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

      <section className="mantra scene-dark" data-scrollscene>
        <div className="sticky">
          <p>FOCUSED VISION.<br />MEASURED EXECUTION.</p>
          <div className="mantra-track"><span>CREATE</span><b>＋</b><span>IMPACT</span><b>＋</b><span>INSPIRE</span><b>＋</b><span>INNOVATE</span></div>
          <div className="wipe-bars"><i /><i /><i /><i /></div>
        </div>
      </section>

      <section id="facts" className="facts scene-light">
        <div className="facts-title"><h2>Key facts</h2><p>A snapshot of our<br />experience and impact.</p></div>
        <div className="cards">
          <article className="fact award">
            <small>FEATURED & AWARDS</small>
            <div className="lion-img lion-left" />
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
            <div className="lion-img lion-right" />
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
