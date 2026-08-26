import sanitizeHtml from "sanitize-html";
import type { ArticleSection, BlogArticle, ContentKind, PortfolioProject, ServiceItem } from "./content-types";

function text(value: unknown, field: string, max = 500) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required.`);
  return value.trim().slice(0, max);
}

function optionalText(value: unknown, fallback = "", max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

function boolean(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function slug(value: unknown, fallback: string) {
  const source = typeof value === "string" && value.trim() ? value : fallback;
  const result = source.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);
  if (!result) throw new Error("A valid slug is required.");
  return result;
}

function contentUrl(value: unknown, field: string, fallback = "") {
  const result = optionalText(value, fallback, 2000);
  if (!result) throw new Error(`${field} is required.`);
  if (result.startsWith("/") && !result.startsWith("//")) return result;
  try {
    const parsed = new URL(result);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
    return parsed.toString();
  } catch {
    throw new Error(`${field} must be a website URL or a path beginning with /.`);
  }
}

function optionalContentUrl(value: unknown, field: string) {
  const result = optionalText(value, "", 2000);
  return result ? contentUrl(result, field) : "";
}

function sections(value: unknown): ArticleSection[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 30).map((section) => {
    const item = section as Partial<ArticleSection>;
    const paragraphs = Array.isArray(item.paragraphs)
      ? item.paragraphs.map((entry) => optionalText(entry, "", 5000)).filter(Boolean).slice(0, 20)
      : [];
    const bullets = Array.isArray(item.bullets)
      ? item.bullets.map((entry) => optionalText(entry, "", 1000)).filter(Boolean).slice(0, 30)
      : [];
    return { heading: text(item.heading, "Section heading", 240), paragraphs, ...(bullets.length ? { bullets } : {}) };
  });
}

export function sanitizeBlogHtml(value: unknown) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Description is required.");
  const cleaned = sanitizeHtml(value.slice(0, 100000), {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "h2", "h3", "ul", "ol", "li", "blockquote", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { a: ["http", "https", "mailto"] },
  }).trim();
  if (!cleaned) throw new Error("Description is required.");
  return cleaned;
}

function plainTextFromHtml(value: string) {
  const spaced = value.replace(/<\/(p|h2|h3|li|blockquote)>/gi, (tag) => tag + " ");
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
function currentDisplayDate() {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .format(new Date()).toUpperCase();
}

export function parseContent(kind: ContentKind, value: unknown): PortfolioProject | ServiceItem | BlogArticle {
  if (!value || typeof value !== "object") throw new Error("Invalid content data.");
  const input = value as Record<string, unknown>;
  if (kind === "portfolio") {
    const title = text(input.title, "Project title", 180);
    const size = ["medium", "large", "xlarge"].includes(String(input.size)) ? String(input.size) as PortfolioProject["size"] : "large";
    const side = ["left", "right", "center"].includes(String(input.side)) ? String(input.side) as PortfolioProject["side"] : "left";
    return {
      title, slug: slug(input.slug, title), category: text(input.category, "Category", 180),
      image: contentUrl(input.image, "Image"), projectUrl: contentUrl(input.projectUrl, "Project link", "/contact"),
      description: optionalText(input.description, "", 2000), size, side,
      sortOrder: number(input.sortOrder), published: boolean(input.published),
    };
  }
  if (kind === "services") {
    const items = Array.isArray(input.items)
      ? input.items.map((item) => optionalText(item, "", 180)).filter(Boolean).slice(0, 20)
      : [];
    const motif = ["rings", "frame", "signal", "orbit"].includes(String(input.motif)) ? String(input.motif) as ServiceItem["motif"] : "rings";
    return {
      number: text(input.number, "Service number", 12), title: text(input.title, "Service title", 180),
      label: text(input.label, "Service label", 180), copy: text(input.copy, "Description", 3000),
      items, motif, sortOrder: number(input.sortOrder), published: boolean(input.published),
    };
  }

  const title = text(input.title, "Article title", 240);
  const contentHtml = sanitizeBlogHtml(input.contentHtml);
  const plainContent = plainTextFromHtml(contentHtml);
  if (!plainContent) throw new Error("Description is required.");
  const excerpt = optionalText(input.excerpt, plainContent.slice(0, 280), 1000) || plainContent.slice(0, 280);
  const intro = optionalText(input.intro, excerpt, 5000) || excerpt;
  const legacySections = sections(input.sections);
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  return {
    slug: slug(input.slug, title),
    category: optionalText(input.category, "INSIGHTS", 120) || "INSIGHTS",
    title,
    image: optionalContentUrl(input.image, "Featured image"),
    excerpt,
    date: optionalText(input.date, currentDisplayDate(), 40) || currentDisplayDate(),
    readTime: optionalText(input.readTime, `${Math.max(1, Math.ceil(wordCount / 200))} MIN READ`, 40),
    accent: optionalText(input.accent, "#5bb8e8", 20),
    intro,
    contentHtml,
    sections: legacySections.length ? legacySections : [{ heading: "Article", paragraphs: [plainContent] }],
    sortOrder: number(input.sortOrder),
    published: boolean(input.published),
  };
}

export function isContentKind(value: string): value is ContentKind {
  return value === "portfolio" || value === "services" || value === "blogs";
}
