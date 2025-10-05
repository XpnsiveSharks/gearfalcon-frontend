// JWT utility functions for reusable token operations

export type JwtPayload = {
  role?: string;
  sub?: string;
  name?: string;
  email?: string;
  is_verified?: boolean;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function getUserRole(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.role || null;
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;

  return payload.exp * 1000 < Date.now();
}

export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;

  return new Date(payload.exp * 1000);
}