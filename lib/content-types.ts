export type PortfolioProject = {
  id?: number;
  title: string;
  slug: string;
  category: string;
  image: string;
  projectUrl: string;
  description: string;
  size: "medium" | "large" | "xlarge";
  side: "left" | "right" | "center";
  sortOrder: number;
  published: boolean;
};

export type ServiceItem = {
  id?: number;
  number: string;
  title: string;
  label: string;
  copy: string;
  items: string[];
  motif: "rings" | "frame" | "signal" | "orbit";
  sortOrder: number;
  published: boolean;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogArticle = {
  id?: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  accent: string;
  intro: string;
  sections: ArticleSection[];
  sortOrder: number;
  published: boolean;
};

export type ContentKind = "portfolio" | "services" | "blogs";
