import { requireRole } from "@/app/_shared/lib/auth-guard";
import CustomerDashboardClient from "./components/CustomerDashboardClient";

export default async function CustomerDashboard() {
  // Server-side authentication - only customers can access this page
  const { user } = await requireRole("customer");

  return <CustomerDashboardClient user={user} />;
}