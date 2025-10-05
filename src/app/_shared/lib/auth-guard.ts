import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, isTokenExpired, type JwtPayload } from "./jwt";

export type UserRole = "admin" | "customer" | "technician";

export interface AuthGuardResult {
  user: JwtPayload;
  role: UserRole;
}

/**
 * Server-side authentication guard that validates JWT tokens and user roles
 * @param allowedRoles - Array of roles allowed to access the protected route
 * @returns AuthGuardResult containing user payload and role
 * @throws Redirects to appropriate page if authentication fails
 */
export async function authGuard(allowedRoles: UserRole[]): Promise<AuthGuardResult> {
  // Get access token from cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // Check if token exists
  if (!accessToken) {
    redirect("/login");
  }

  // Decode and validate token
  const payload = decodeJwt(accessToken);
  if (!payload) {
    redirect("/login");
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    redirect("/login");
  }

  // Validate required fields
  if (!payload.role || !payload.sub || !payload.email) {
    redirect("/login");
  }

  // Check if user role is allowed
  const userRole = payload.role.toLowerCase() as UserRole;
  if (!allowedRoles.includes(userRole)) {
    redirect("/");
  }

  return {
    user: payload,
    role: userRole,
  };
}

/**
 * Convenience function for single role protection
 * @param role - Single role allowed to access the route
 * @returns AuthGuardResult containing user payload and role
 */
export async function requireRole(role: UserRole): Promise<AuthGuardResult> {
  return authGuard([role]);
}

/**
 * Check if user is authenticated without role restrictions
 * @returns User payload if authenticated, redirects to login if not
 */
export async function requireAuth(): Promise<JwtPayload> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const payload = decodeJwt(accessToken);
  if (!payload || isTokenExpired(accessToken)) {
    redirect("/login");
  }

  return payload;
}