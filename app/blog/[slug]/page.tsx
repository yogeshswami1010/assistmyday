import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InnerPages from "../../components/InnerPages";
import BlogArticleExperience from "../../components/BlogArticleExperience";
import { getBlogArticle, getBlogArticles } from "../../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function absoluteImageUrl(image?: string) {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  try { return new URL(image, siteUrl).toString(); } catch { return undefined; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) return { title: "Article not found | Assistmyday", robots: { index: false } };
  const title = `${article.title} | Assistmyday`;
  const image = absoluteImageUrl(article.image);
  return {
    title,
    description: article.excerpt,
    openGraph: { title, description: article.excerpt, images: image ? [image] : [] },
    twitter: { title, description: article.excerpt, images: image ? [image] : [] },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getBlogArticle(slug), getBlogArticles()]);
  if (!article) notFound();
  const recent = allArticles.filter((item) => item.slug !== article.slug).slice(0, 5);
  const related = recent.slice(0, 2);
  return <InnerPages active="BLOG"><BlogArticleExperience article={article} related={related} recent={recent} /></InnerPages>;
}