import type { Metadata } from "next";
import Link from "next/link";
import InnerPages from "./components/InnerPages";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found | Assistmyday",
  description: "Find your way back to Assistmyday for software, websites, and digital marketing.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <InnerPages active="">
      <section className={styles.hero} aria-labelledby="not-found-title">
        <div className={styles.content}>
          <p className={styles.kicker}>404 / PAGE NOT FOUND</p>
          <h1 id="not-found-title">A little off track.<br /><em>Still plenty ahead.</em></h1>
          <p className={styles.copy}>The page you’re looking for may have moved or no longer exists. Let’s get you back to something useful.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/">BACK TO HOME <span aria-hidden="true">↗</span></Link>
            <Link className={styles.secondary} href="/contact">GET IN TOUCH <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.orbit} />
          <span className={styles.code}>404</span>
          <span className={styles.caption}>A NEW DIRECTION STARTS HERE</span>
        </div>
      </section>
      <nav className={styles.explore} aria-label="Explore Assistmyday">
        <p>Find your next step.</p>
        <Link href="/services">Explore our services <span aria-hidden="true">↗</span></Link>
        <Link href="/portfolio">See our work <span aria-hidden="true">↗</span></Link>
        <Link href="/blog">Read the latest insights <span aria-hidden="true">↗</span></Link>
      </nav>
    </InnerPages>
  );
}
