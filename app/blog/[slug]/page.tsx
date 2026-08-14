import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InnerPages from "../../components/InnerPages";
import BlogArticleExperience from "../../components/BlogArticleExperience";
import { articles, getArticle } from "../articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found | Assistmyday" };
  return { title: `${article.title} | Assistmyday`, description: article.excerpt };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  return <InnerPages active="BLOG"><BlogArticleExperience article={article} related={related} /></InnerPages>;
}
