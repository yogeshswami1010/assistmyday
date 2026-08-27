import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import { getBlogArticles } from "../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Insights | Assistmyday",
  description: "Practical thinking on software, web design, automation, SEO, and digital growth.",
};

export default async function BlogPage() {
  const articles = await getBlogArticles();
  return (
    <InnerPages active="BLOG">
      <section className="inner-hero">
        <div><p className="inner-kicker">INSIGHTS / IDEAS</p><h1>Useful thinking for better digital <em>decisions.</em></h1></div>
        <p className="inner-hero-copy">Perspectives on software, websites, automation, marketing, and the systems behind sustainable growth.</p>
      </section>
      <section className="inner-section">
        <div className="inner-section-head"><h2>Latest perspectives.</h2><p>Clear, practical ideas for leaders building digital products, improving operations, and creating stronger demand.</p></div>
        <div className="blog-grid">{articles.map((article, index) => <article className="blog-card" key={article.slug}><small>{String(index + 1).padStart(2, "0")} / {article.category}</small><h2>{article.title}</h2><p>{article.excerpt}</p><a href={"/blog/" + article.slug}>READ ARTICLE →</a></article>)}</div>
      </section>
    </InnerPages>
  );
}