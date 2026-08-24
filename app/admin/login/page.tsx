import { redirect } from "next/navigation";
import { getAdminSession, isAdminAuthConfigured } from "../../../lib/admin-auth";
import AdminLogin from "../AdminLogin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login | Assistmyday", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <AdminLogin configured={isAdminAuthConfigured()} />;
}
