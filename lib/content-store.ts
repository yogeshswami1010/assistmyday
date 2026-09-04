import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { articles as blogSeeds } from "../app/blog/articles";
import { portfolioSeeds, serviceSeeds } from "./content-seeds";
import type { BlogArticle, ContentKind, PortfolioProject, ServiceItem } from "./content-types";
import { sanitizeBlogHtml } from "./content-validation";

type PortfolioRow = RowDataPacket & {
  id: number; title: string; slug: string; category: string; image_url: string;
  project_url: string; description: string; size: PortfolioProject["size"];
  side: PortfolioProject["side"]; sort_order: number; published: number;
};
type ServiceRow = RowDataPacket & {
  id: number; number_label: string; title: string; label: string; copy: string;
  items_json: string; motif: ServiceItem["motif"]; sort_order: number; published: number;
};
type MediaRow = RowDataPacket & {
  id: number;
  filename: string;
  content_type: string;
  data: Buffer;
  size_bytes: number;
};

type BlogRow = RowDataPacket & {
  id: number; slug: string; category: string; title: string; image_url: string | null; excerpt: string;
  display_date: string; read_time: string; accent: string; intro: string; content_html: string | null;
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

export function describeDatabaseError(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "UNKNOWN";
  const messages: Record<string, string> = {
    ER_ACCESS_DENIED_ERROR: "MySQL rejected the database username or password. Reset the MySQL user password in Hostinger, update DB_PASSWORD, and redeploy.",
    ER_BAD_DB_ERROR: "MySQL could not find DB_NAME. Copy the exact database name from Hostinger and redeploy.",
    ER_DBACCESS_DENIED_ERROR: "The MySQL user does not have access to this database. Reassign the user to the database in Hostinger.",
    ER_TABLEACCESS_DENIED_ERROR: "The MySQL user cannot create or update the required content tables.",
    ECONNREFUSED: "MySQL refused the connection. Keep DB_HOST as localhost and DB_PORT as 3306, then restart the Node.js application.",
    ETIMEDOUT: "The MySQL connection timed out. Restart the Node.js application and check Hostinger runtime logs.",
    ENOTFOUND: "DB_HOST could not be resolved. Use localhost for a Hostinger MySQL database.",
  };
  return messages[code] || `MySQL connection failed (${code}). Check the Node.js runtime logs in Hostinger.`;
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
  await pool.query("CREATE TABLE IF NOT EXISTS amd_media (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(255) NOT NULL, content_type VARCHAR(80) NOT NULL, data LONGBLOB NOT NULL, size_bytes INT UNSIGNED NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
  await pool.query(`CREATE TABLE IF NOT EXISTS amd_blogs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(120) NOT NULL,
    title VARCHAR(240) NOT NULL,
    image_url TEXT NULL,
    excerpt TEXT NOT NULL,
    display_date VARCHAR(40) NOT NULL,
    read_time VARCHAR(40) NOT NULL,
    accent VARCHAR(20) NOT NULL DEFAULT '#5bb8e8',
    intro TEXT NOT NULL,
    content_html LONGTEXT NULL,
    sections_json LONGTEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const [imageColumn] = await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM amd_blogs LIKE 'image_url'");
  if (!imageColumn.length) await pool.query("ALTER TABLE amd_blogs ADD COLUMN image_url TEXT NULL AFTER title");
  const [contentColumn] = await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM amd_blogs LIKE 'content_html'");
  if (!contentColumn.length) await pool.query("ALTER TABLE amd_blogs ADD COLUMN content_html LONGTEXT NULL AFTER intro");
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
      `INSERT INTO amd_blogs (slug, category, title, image_url, excerpt, display_date, read_time, accent, intro, content_html, sections_json, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.slug, item.category, item.title, item.image || "", item.excerpt, item.date, item.readTime, item.accent, item.intro, item.contentHtml || "", JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0],
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
  id: row.id, slug: row.slug, category: row.category, title: row.title, image: row.image_url || "", excerpt: row.excerpt,
  date: row.display_date, readTime: row.read_time, accent: row.accent, intro: row.intro, contentHtml: row.content_html ? sanitizeBlogHtml(row.content_html) : "",
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
  const [rows] = await getPool().query<BlogRow[]>("SELECT * FROM amd_blogs ORDER BY sort_order, id");
  const merged = new Map(blogSeeds.map((item) => [item.slug, item]));
  rows.map(mapBlog).forEach((item) => merged.set(item.slug, item));
  return Array.from(merged.values())
    .filter((item) => includeUnpublished || item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

async function getBlogArticleFromDatabase(slug: string, includeUnpublished = false) {
  const seed = blogSeeds.find((item) => item.slug === slug && (includeUnpublished || item.published));
  if (!isDatabaseConfigured()) return seed;
  await ensureSchema();
  const [rows] = await getPool().execute<BlogRow[]>("SELECT * FROM amd_blogs WHERE slug = ? LIMIT 1", [slug]);
  if (!rows[0]) return seed;
  const article = mapBlog(rows[0]);
  return includeUnpublished || article.published ? article : undefined;
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
export async function createMedia(filename: string, contentType: string, data: Buffer) {
  await ensureSchema();
  const [result] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO amd_media (filename, content_type, data, size_bytes) VALUES (?, ?, ?, ?)",
    [filename.slice(0, 255), contentType, data, data.byteLength],
  );
  return result.insertId;
}

export async function getMedia(id: number) {
  await ensureSchema();
  const [rows] = await getPool().execute<MediaRow[]>(
    "SELECT id, filename, content_type, data, size_bytes FROM amd_media WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: row.id,
    filename: row.filename,
    contentType: row.content_type,
    data: row.data,
    size: row.size_bytes,
  };
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
    (slug, category, title, image_url, excerpt, display_date, read_time, accent, intro, content_html, sections_json, sort_order, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [item.slug, item.category, item.title, item.image || "", item.excerpt, item.date, item.readTime, item.accent, item.intro, item.contentHtml || "", JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0]);
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
    await pool.execute(`UPDATE amd_blogs SET slug=?, category=?, title=?, image_url=?, excerpt=?, display_date=?, read_time=?, accent=?, intro=?, content_html=?, sections_json=?, sort_order=?, published=? WHERE id=?`,
      [item.slug, item.category, item.title, item.image || "", item.excerpt, item.date, item.readTime, item.accent, item.intro, item.contentHtml || "", JSON.stringify(item.sections), item.sortOrder, item.published ? 1 : 0, id]);
  }
}

export async function deleteContent(kind: ContentKind, id: number) {
  await ensureSchema();
  const table = kind === "portfolio" ? "amd_portfolio" : kind === "services" ? "amd_services" : "amd_blogs";
  await getPool().execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
}
