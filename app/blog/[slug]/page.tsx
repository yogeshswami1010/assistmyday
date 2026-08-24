import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InnerPages from "../../components/InnerPages";
import BlogArticleExperience from "../../components/BlogArticleExperience";
import { getBlogArticle, getBlogArticles } from "../../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) return { title: "Article not found | Assistmyday", robots: { index: false } };
  const title = `${article.title} | Assistmyday`;
  return {
    title,
    description: article.excerpt,
    openGraph: { title, description: article.excerpt, images: [] },
    twitter: { title, description: article.excerpt, images: [] },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getBlogArticle(slug), getBlogArticles()]);
  if (!article) notFound();
  const related = allArticles.filter((item) => item.slug !== article.slug).slice(0, 2);
  return <InnerPages active="BLOG"><BlogArticleExperience article={article} related={related} /></InnerPages>;
}