import { User } from "@/app/shared/types/User";

export async function registerAdminUser(user: User) {
  const res = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...user, role: "Admin" }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to register admin user");
  }

  return res.json();
}
