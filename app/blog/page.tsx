import type { Metadata } from "next";
import Image from "next/image";
import InnerPages from "../components/InnerPages";
import { getBlogArticles } from "../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Insights | Assistmyday",
  description: "Practical thinking on software, web design, automation, SEO, and digital growth.",
};

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const articles = await getBlogArticles();
  const requestedPage = Number.parseInt((await searchParams)?.page || "1", 10);
  const totalPages = Math.max(1, Math.ceil(articles.length / POSTS_PER_PAGE));
  const currentPage = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
  const visibleArticles = articles.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const pageHref = (page: number) => page === 1 ? "/blog#latest-posts" : `/blog?page=${page}#latest-posts`;
  return (
    <InnerPages active="BLOG">
      <section className="inner-hero">
        <div><p className="inner-kicker">INSIGHTS / IDEAS</p><h1>Useful thinking for better digital <em>decisions.</em></h1></div>
        <p className="inner-hero-copy">Perspectives on software, websites, automation, marketing, and the systems behind sustainable growth.</p>
      </section>
      <section className="inner-section" id="latest-posts">
        <div className="inner-section-head"><h2>Latest perspectives.</h2><p>Clear, practical ideas for leaders building digital products, improving operations, and creating stronger demand.</p></div>
        <div className="blog-grid">
          {visibleArticles.map((article) => {
            const href = "/blog/" + article.slug;

            return (
              <article className="blog-card" key={article.slug}>
                <a className="blog-card-media" href={href} aria-label={"Read " + article.title}>
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <span>ASSISTMYDAY / INSIGHTS</span>
                  )}
                </a>
                <div className="blog-card-content">
                  <time className="blog-card-date">PUBLISHED {article.date}</time>
                  <a className="blog-card-title" href={href}><h2>{article.title}</h2></a>
                  <p>{article.excerpt}</p>
                </div>
              </article>
            );
          })}
        </div>
        {totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Blog pages">
            {currentPage > 1 ? <a href={pageHref(currentPage - 1)} rel="prev">← PREVIOUS</a> : <span aria-disabled="true">← PREVIOUS</span>}
            <div>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <a href={pageHref(page)} aria-current={page === currentPage ? "page" : undefined} key={page}>{String(page).padStart(2, "0")}</a>
              ))}
            </div>
            {currentPage < totalPages ? <a href={pageHref(currentPage + 1)} rel="next">NEXT →</a> : <span aria-disabled="true">NEXT →</span>}
          </nav>
        )}
      </section>
    </InnerPages>
  );
}