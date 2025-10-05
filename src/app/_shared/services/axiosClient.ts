/*
 *************************** Secure HTTP-Only Cookie axiosClient ***************************
 1. Docker-aware configuration for server-side and client-side requests
 2. Secure authentication via HTTP-only cookies
 3. Automatic service discovery for Docker containers
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Smart URL resolution for Docker and local development
const getBaseURL = (): string => {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // SERVER-SIDE (Next.js API routes in Docker container)
    // Use Docker service name for container-to-container communication
    const serverURL = process.env.BACKEND_URL || 'http://backend:80';
    console.log('🐳 Server-side request detected, using:', serverURL);
    return serverURL;
  } else {
    // CLIENT-SIDE (Browser)
    // Use localhost for browser requests
    const clientURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    console.log('🌐 Client-side request detected, using:', clientURL);
    return clientURL;
  }
};

const BASE_URL = getBaseURL();

// Debug logging for environment variables
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Axios Client Configuration:', {
    isServer: typeof window === 'undefined',
    BACKEND_URL: process.env.BACKEND_URL || 'NOT SET',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
    resolvedURL: BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    withCredentials: true,
  });
}

// Enhanced configuration options
const AXIOS_CONFIG = {
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  maxRedirects: 5,
  validateStatus: function (status: number) {
    return status >= 200 && status < 300;
  },
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
  },
};

// ----------------------
// Enhanced Axios instances
// ----------------------
export const http: AxiosInstance = axios.create(AXIOS_CONFIG);

// Separate instance for token refresh to avoid recursion through interceptors
const refreshHttp = axios.create({
  ...AXIOS_CONFIG,
  timeout: 10000, // Shorter timeout for refresh requests
});

// ----------------------
// Simplified Request interceptor
// ----------------------
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Enhanced logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        isServer: typeof window === 'undefined',
        baseURL: config.baseURL,
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        params: config.params,
        data: config.data ? '(data present)' : '(no data)',
      });

      // Log the exact payload being sent
      if (config.data) {
        console.log('📦 Payload being sent:', JSON.stringify(config.data, null, 2));
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ----------------------
// Simplified Response interceptor
// ----------------------
http.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        hasData: !!response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status || error.code} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        isServer: typeof window === 'undefined',
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }

    // For 401 errors, the server-side auth check will handle redirect
    // No client-side token refresh needed with HTTP-only cookies
    return Promise.reject(error);
  }
);

/*
Secure HTTP-Only Cookie Usage Instructions:

 1. Use `http` instance for all API requests:
     import { http } from "@/app/_shared/services/axiosClient";
     const { data } = await http.get("/api/user/me");

 2. HTTP-only cookies are sent automatically:
     - No token management needed in client-side code
     - Browser automatically includes cookies with requests
     - Server-side authentication via /api/auth/* endpoints

 3. Authentication flow:
     - Login: POST /api/auth/login (sets HTTP-only cookies)
     - Auth check: GET /api/auth/check (verifies cookies server-side)
     - Logout: POST /api/auth/logout (clears cookies)

 4. Docker support:
     - Server-side: Uses BACKEND_URL (e.g., http://backend:8080)
     - Client-side: Uses NEXT_PUBLIC_API_URL (e.g., http://localhost:8080)

 5. Security benefits:
     - Tokens never exposed to client-side JavaScript
     - Protected against XSS attacks
     - Automatic credential handling by browser
 */

// Utility functions for external use
export const axiosUtils = {
  // Check if error is a network error
  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  // Check if error is a timeout error
  isTimeoutError: (error: any): boolean => {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  },

  // Get error message from axios error
  getErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (axiosUtils.isNetworkError(error)) {
      return 'Network error - please check your connection';
    }
    if (axiosUtils.isTimeoutError(error)) {
      return 'Request timeout - please try again';
    }
    return error.message || 'Unknown error occurred';
  }
};