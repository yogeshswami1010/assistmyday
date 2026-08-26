import { requireAdminSession } from "../../lib/admin-auth";
import { describeDatabaseError, getBlogArticles, getPortfolioProjects, getServices, isDatabaseConfigured } from "../../lib/content-store";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Content Admin | Assistmyday", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await requireAdminSession();
  let databaseReady = isDatabaseConfigured();
  let databaseMessage = databaseReady ? "" : "Database environment variables are missing.";
  let portfolio: Awaited<ReturnType<typeof getPortfolioProjects>> = [];
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let blogs: Awaited<ReturnType<typeof getBlogArticles>> = [];

  if (databaseReady) {
    try {
      [portfolio, services, blogs] = await Promise.all([
        getPortfolioProjects(true, true),
        getServices(true, true),
        getBlogArticles(true, true),
      ]);
    } catch (error) {
      console.error("Admin database connection failed.", error);
      databaseMessage = describeDatabaseError(error);
      databaseReady = false;
    }
  }

  return <AdminPanel email={session.email} databaseReady={databaseReady} databaseMessage={databaseMessage} initialRecords={{ portfolio, services, blogs }} />;
}
