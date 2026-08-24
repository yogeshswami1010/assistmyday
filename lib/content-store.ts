import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { articles as blogSeeds } from "../app/blog/articles";
import { portfolioSeeds, serviceSeeds } from "./content-seeds";
import type { BlogArticle, ContentKind, PortfolioProject, ServiceItem } from "./content-types";

type PortfolioRow = RowDataPacket & {
  id: number; title: string; slug: string; category: string; image_url: string;
  project_url: string; description: string; size: PortfolioProject["size"];
  side: PortfolioProject["side"]; sort_order: number; published: number;
};
type ServiceRow = RowDataPacket & {
  id: number; number_label: string; title: string; label: string; copy: string;
  items_json: string; motif: ServiceItem["motif"]; sort_order: number; published: number;
};
type BlogRow = RowDataPacket & {
  id: number; slug: string; category: string; title: string; excerpt: string;
  display_date: string; read_time: string; accent: string; intro: string;
  sections_json: string; sort_order: number; published: number;
};

const globalDatabase = globalThis as typeof globalThis & {
  assistmydayPool?: Pool;
  assistmydaySchemaReady?: Promise<void>;
};

export function isDatabaseConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
      (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME),
  );
}

function getPool() {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!globalDatabase.assistmydayPool) {
    globalDatabase.assistmydayPool = process.env.DATABASE_URL
      ? mysql.createPool(process.env.DATABASE_URL!)
      : mysql.createPool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 3306),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          connectionLimit: 5,
          enableKeepAlive: true,
          charset: "utf8mb4",
        });
  }
  return globalDatabase.assistmydayPool;
}

async function ensureSchema() {
  if (!isDatabaseConfigured()) return;
  if (!globalDatabase.assistmydaySchemaReady) {
    globalDatabase.assistmydaySchemaReady = initializeSchema().catch((error) => {
      globalDatabase.assistmydaySchemaReady = undefined;
      throw error;
    });
  }
  await globalDatabase.assistmydaySchemaReady;
}

async function initializeSchema() {
  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS amd_portfolio (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(180) NOT NULL,
    image_url TEXT NOT NULL,
    project_url TEXT NOT NULL,
    description TEXT NOT NULL,
    size VARCHAR(20) NOT NULL DEFAULT 'large',
    side VARCHAR(20) NOT NULL DEFAULT 'left',
    sort_order INT NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS amd_services (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    number_label VARCHAR(12) NOT NULL,
    title VARCHAR(180) NOT NULL,
    label VARCHAR(180) NOT NULL,
    copy TEXT NOT NULL,
    items_json LONGTEXT NOT NULL,
    motif VARCHAR(24) NOT NULL DEFAULT 'rings',
    sort_order INT NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS amd_blogs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(120) NOT NULL,
    title VARCHAR(240) NOT NULL,
    excerpt TEXT NOT NULL,
    display_date VARCHAR(40) NOT NULL,
    read_time VARCHAR(40) NOT NULL,
    accent VARCHAR(20) NOT NULL DEFAULT '#5bb8e8',
    intro TEXT NOT NULL,
    sections_json LONGTEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await seedTable("amd_portfolio", portfolioSeeds, async (item) => {
    await pool.execute(
      `INSERT INTO amd_portfolio (title, slug, category, image_url, project_url, description, size, side, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.title, item.slug, item.category, item.image, item.projectUrl, item.description, item.size, item.side, item.sortOrder, item.published ? 1 : 0],
    );
  });
  await seedTable("amd_services", serviceSeeds, async (item) => {
    await pool.execute(
      `INSERT INTO amd_services (number_label, title, label, copy, items_json, motif, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.number, item.title, item.label, item.copy, JSON.stringify(item.items), item.motif, item.sortOrder, item.published ? 1 : 0],
    );
  });
  await seedTable("amd_blogs", blogSeeds, async (item) => {
    await pool.execute(
      `INSERT INTO amd_blogs (slug, category, title, excerpt, display_date, read_time, accent, intro, sections_json, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.slug, item.category, item.title, item.excerpt, item.date, item.readTime, item.accent, item.intro, JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0],
    );
  });
}

async function seedTable<T>(table: string, seeds: T[], insert: (item: T) => Promise<void>) {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM ${table}`);
  if (Number(rows[0]?.count || 0) > 0) return;
  for (const item of seeds) await insert(item);
}

function safeJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

const mapPortfolio = (row: PortfolioRow): PortfolioProject => ({
  id: row.id, title: row.title, slug: row.slug, category: row.category, image: row.image_url,
  projectUrl: row.project_url, description: row.description, size: row.size, side: row.side,
  sortOrder: row.sort_order, published: Boolean(row.published),
});
const mapService = (row: ServiceRow): ServiceItem => ({
  id: row.id, number: row.number_label, title: row.title, label: row.label, copy: row.copy,
  items: safeJson<string[]>(row.items_json, []), motif: row.motif, sortOrder: row.sort_order,
  published: Boolean(row.published),
});
const mapBlog = (row: BlogRow): BlogArticle => ({
  id: row.id, slug: row.slug, category: row.category, title: row.title, excerpt: row.excerpt,
  date: row.display_date, readTime: row.read_time, accent: row.accent, intro: row.intro,
  sections: safeJson(row.sections_json, []), sortOrder: row.sort_order, published: Boolean(row.published),
});

async function getPortfolioProjectsFromDatabase(includeUnpublished = false) {
  if (!isDatabaseConfigured()) return portfolioSeeds.filter((item) => includeUnpublished || item.published);
  await ensureSchema();
  const [rows] = await getPool().query<PortfolioRow[]>(
    `SELECT * FROM amd_portfolio ${includeUnpublished ? "" : "WHERE published = 1"} ORDER BY sort_order, id`,
  );
  return rows.map(mapPortfolio);
}

async function getServicesFromDatabase(includeUnpublished = false) {
  if (!isDatabaseConfigured()) return serviceSeeds.filter((item) => includeUnpublished || item.published);
  await ensureSchema();
  const [rows] = await getPool().query<ServiceRow[]>(
    `SELECT * FROM amd_services ${includeUnpublished ? "" : "WHERE published = 1"} ORDER BY sort_order, id`,
  );
  return rows.map(mapService);
}

async function getBlogArticlesFromDatabase(includeUnpublished = false) {
  if (!isDatabaseConfigured()) return blogSeeds.filter((item) => includeUnpublished || item.published);
  await ensureSchema();
  const [rows] = await getPool().query<BlogRow[]>(
    `SELECT * FROM amd_blogs ${includeUnpublished ? "" : "WHERE published = 1"} ORDER BY sort_order, id`,
  );
  return rows.map(mapBlog);
}

async function getBlogArticleFromDatabase(slug: string, includeUnpublished = false) {
  if (!isDatabaseConfigured()) return blogSeeds.find((item) => item.slug === slug && (includeUnpublished || item.published));
  await ensureSchema();
  const [rows] = await getPool().execute<BlogRow[]>(
    `SELECT * FROM amd_blogs WHERE slug = ? ${includeUnpublished ? "" : "AND published = 1"} LIMIT 1`, [slug],
  );
  return rows[0] ? mapBlog(rows[0]) : undefined;
}

export async function getPortfolioProjects(includeUnpublished = false, strict = false) {
  try {
    return await getPortfolioProjectsFromDatabase(includeUnpublished);
  } catch (error) {
    if (strict) throw error;
    console.error("Portfolio database unavailable; using built-in content.", error);
    return portfolioSeeds.filter((item) => includeUnpublished || item.published);
  }
}

export async function getServices(includeUnpublished = false, strict = false) {
  try {
    return await getServicesFromDatabase(includeUnpublished);
  } catch (error) {
    if (strict) throw error;
    console.error("Services database unavailable; using built-in content.", error);
    return serviceSeeds.filter((item) => includeUnpublished || item.published);
  }
}

export async function getBlogArticles(includeUnpublished = false, strict = false) {
  try {
    return await getBlogArticlesFromDatabase(includeUnpublished);
  } catch (error) {
    if (strict) throw error;
    console.error("Blog database unavailable; using built-in content.", error);
    return blogSeeds.filter((item) => includeUnpublished || item.published);
  }
}

export async function getBlogArticle(slug: string, includeUnpublished = false, strict = false) {
  try {
    return await getBlogArticleFromDatabase(slug, includeUnpublished);
  } catch (error) {
    if (strict) throw error;
    console.error("Blog database unavailable; using built-in article content.", error);
    return blogSeeds.find((item) => item.slug === slug && (includeUnpublished || item.published));
  }
}
export async function createContent(kind: ContentKind, value: PortfolioProject | ServiceItem | BlogArticle) {
  await ensureSchema();
  const pool = getPool();
  if (kind === "portfolio") {
    const item = value as PortfolioProject;
    const [result] = await pool.execute<ResultSetHeader>(`INSERT INTO amd_portfolio
      (title, slug, category, image_url, project_url, description, size, side, sort_order, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [item.title, item.slug, item.category, item.image, item.projectUrl, item.description, item.size, item.side, item.sortOrder, item.published ? 1 : 0]);
    return result.insertId;
  }
  if (kind === "services") {
    const item = value as ServiceItem;
    const [result] = await pool.execute<ResultSetHeader>(`INSERT INTO amd_services
      (number_label, title, label, copy, items_json, motif, sort_order, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [item.number, item.title, item.label, item.copy, JSON.stringify(item.items), item.motif, item.sortOrder, item.published ? 1 : 0]);
    return result.insertId;
  }
  const item = value as BlogArticle;
  const [result] = await pool.execute<ResultSetHeader>(`INSERT INTO amd_blogs
    (slug, category, title, excerpt, display_date, read_time, accent, intro, sections_json, sort_order, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [item.slug, item.category, item.title, item.excerpt, item.date, item.readTime, item.accent, item.intro, JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0]);
  return result.insertId;
}

export async function updateContent(kind: ContentKind, id: number, value: PortfolioProject | ServiceItem | BlogArticle) {
  await ensureSchema();
  const pool = getPool();
  if (kind === "portfolio") {
    const item = value as PortfolioProject;
    await pool.execute(`UPDATE amd_portfolio SET title=?, slug=?, category=?, image_url=?, project_url=?, description=?, size=?, side=?, sort_order=?, published=? WHERE id=?`,
      [item.title, item.slug, item.category, item.image, item.projectUrl, item.description, item.size, item.side, item.sortOrder, item.published ? 1 : 0, id]);
  } else if (kind === "services") {
    const item = value as ServiceItem;
    await pool.execute(`UPDATE amd_services SET number_label=?, title=?, label=?, copy=?, items_json=?, motif=?, sort_order=?, published=? WHERE id=?`,
      [item.number, item.title, item.label, item.copy, JSON.stringify(item.items), item.motif, item.sortOrder, item.published ? 1 : 0, id]);
  } else {
    const item = value as BlogArticle;
    await pool.execute(`UPDATE amd_blogs SET slug=?, category=?, title=?, excerpt=?, display_date=?, read_time=?, accent=?, intro=?, sections_json=?, sort_order=?, published=? WHERE id=?`,
      [item.slug, item.category, item.title, item.excerpt, item.date, item.readTime, item.accent, item.intro, JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0, id]);
  }
}

export async function deleteContent(kind: ContentKind, id: number) {
  await ensureSchema();
  const table = kind === "portfolio" ? "amd_portfolio" : kind === "services" ? "amd_services" : "amd_blogs";
  await getPool().execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
}
