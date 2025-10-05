import { requireRole } from "@/app/_shared/lib/auth-guard";
import AdminDashboardClient from "./components/AdminDashboardClient";

export default async function AdminDashboard() {
  // Server-side authentication - only admins can access this page
  const { user } = await requireRole("admin");

  return <AdminDashboardClient user={user} />;
}