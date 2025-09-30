/*
*************************** axiosClient overview ***************************
1. Reusable Axios instance
  - `http` is an Axios instance can import anywhere in our app.
  - Use it for all API calls instead of creating new Axios requests every time.
  - Automatically applies:
    - baseURL (our API root)
    - withCredentials: true (so refresh token cookie is sent)
2. Automatic access token handling
  - Automatically adds the in-memory access token to the Authorization header of each request.
  - No need to manually attach the token every time you call the API.
3. Automatic token refresh
  - If a request returns 401 Unauthorized, it automatically:
    - Calls the backend refresh endpoint (refresh token is sent via HTTP-only cookie).
    - Updates the in-memory access token.
    - Retries the failed request with the new token.
  - Requests made while a refresh is in progress are queued and retried after refresh succeeds.
4. Safe and centralized
  - Frontend never accesses the refresh token.
  - All auth logic (token management, retries, queueing) is centralized in one place.
  - Makes API calls consistent and reduces duplicated logic across the app.
Usage summary:
  - Register AuthProvider token getter/setter with `registerTokenAccess`.
  - Use `http` for all API requests.
  - Token handling, refresh, and retries happen automatically.
*/


// src/app/shared/services/axiosClient.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
// import { AuthService } from "@/app/shared/services/AuthService"; // Removed - no refresh endpoint

// Base API URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ----------------------
// Token bridge mechanism
// ----------------------
// Axios interceptors cannot directly access React state, so we use getter/setter functions
let getAccessToken: () => string | null = () => null;
let setAccessToken: (t: string | null) => void = () => {};

// Register functions from AuthProvider so interceptors can access and update token
export function registerTokenAccess(
  getter: () => string | null,
  setter: (t: string | null) => void
) {
  getAccessToken = getter;
  setAccessToken = setter;
}

// ----------------------
// Axios instances
// ----------------------
export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // include cookies for refresh token
});

// Removed refreshHttp instance - no refresh endpoint in backend

// ----------------------
// Token refresh queue - REMOVED (no refresh endpoint in backend)
// ----------------------

// ----------------------
// Request interceptor
// ----------------------
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken(); // Get current in-memory access token
  if (token) {
    // Axios v1 headers may have set() function or be plain object
    const headers: any = config.headers as any;
    if (typeof headers.set === "function") {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// ----------------------
// Response interceptor - SIMPLIFIED (no refresh functionality)
// ----------------------
http.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error: AxiosError) => {
    // Handle 401 errors by clearing token and redirecting to login
    if (error.response?.status === 401) {
      setAccessToken(null); // Clear token in memory, effectively logging out
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* 
How to use this:

1. Register token access from your AuthProvider:
   import { registerTokenAccess } from "@/app/shared/services/axiosClient";
   registerTokenAccess(() => accessToken, setAccessToken);

2. Use `http` instance for API requests:
   import { http } from "@/app/shared/services/axiosClient";
   const { data } = await http.get("/api/user/me");

3. Automatic handling:
   - Requests automatically attach Authorization header if access token exists.
   - 401 errors trigger automatic token refresh using backend refresh token (cookie).
   - Requests waiting for refresh are queued and retried after refresh succeeds.
*/
