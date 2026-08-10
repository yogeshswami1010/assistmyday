import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";

export const metadata: Metadata = {
  title: "Insights | Assistmyday",
  description: "Practical thinking on software, web design, automation, SEO, and digital growth.",
};

const articles = [
  ["SOFTWARE", "When custom software becomes the smarter business decision", "A practical framework for deciding when off-the-shelf tools are holding your operations back."],
  ["WEB STRATEGY", "Why a high-performance website is more than a redesign", "How positioning, user journeys, speed, and conversion architecture work together."],
  ["AUTOMATION", "Five workflows worth automating before you add more headcount", "Where growing teams can remove repetitive work and create more reliable operations."],
  ["SEO", "Building search visibility around real customer intent", "A better approach to connecting technical SEO, useful content, and commercial priorities."],
  ["PAID MEDIA", "From campaign metrics to meaningful business outcomes", "How to structure reporting around qualified demand, revenue, and better decisions."],
  ["BRAND", "Design systems that help growing companies move faster", "Why a practical identity system improves consistency across teams, channels, and campaigns."],
];

export default function BlogPage() {
  return (
    <InnerPages active="BLOG">
      <section className="inner-hero">
        <div><p className="inner-kicker">INSIGHTS / IDEAS</p><h1>Useful thinking for better digital <em>decisions.</em></h1></div>
        <p className="inner-hero-copy">Perspectives on software, websites, automation, marketing, and the systems behind sustainable growth.</p>
      </section>
      <section className="inner-section">
        <div className="inner-section-head"><h2>Latest perspectives.</h2><p>Clear, practical ideas for leaders building digital products, improving operations, and creating stronger demand.</p></div>
        <div className="blog-grid">{articles.map(([category, title, copy], index) => <article className="blog-card" key={title}><small>{String(index + 1).padStart(2, "0")} / {category}</small><h2>{title}</h2><p>{copy}</p><a href="/contact">DISCUSS THIS WITH OUR TEAM →</a></article>)}</div>
      </section>
    </InnerPages>
  );
}
