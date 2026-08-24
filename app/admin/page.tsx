import { requireAdminSession } from "../../lib/admin-auth";
import { getBlogArticles, getPortfolioProjects, getServices, isDatabaseConfigured } from "../../lib/content-store";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Content Admin | Assistmyday", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await requireAdminSession();
  const databaseReady = isDatabaseConfigured();
  const [portfolio, services, blogs] = databaseReady
    ? await Promise.all([getPortfolioProjects(true), getServices(true), getBlogArticles(true)])
    : [[], [], []];
  return <AdminPanel email={session.email} databaseReady={databaseReady} initialRecords={{ portfolio, services, blogs }} />;
}
