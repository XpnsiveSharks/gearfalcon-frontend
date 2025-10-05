/*
 *************************** Secure HTTP-Only Cookie axiosClient ***************************
 1. Reusable Axios instance with HTTP-only cookie support
     - `http` is an Axios instance for all API calls
     - Automatically applies:
       - baseURL (API root)
       - withCredentials: true (sends HTTP-only cookies automatically)
       - Request timeout and retry configuration
   2. Secure authentication via HTTP-only cookies
     - No token injection or storage in client-side memory
     - Cookies are sent automatically by browser
     - Maximum security against XSS attacks
   3. Simplified error handling
     - Handles 401 errors appropriately
     - Enhanced logging in development mode
     - Better error context and debugging
   4. Secure and centralized
     - No token management in client-side JavaScript
     - Authentication handled entirely server-side
     - Makes API calls consistent and secure
   Usage summary:
     - Use `http` for all API requests.
     - HTTP-only cookies are sent automatically.
     - No token handling needed in client code.
     - Server-side authentication via /api/auth/* endpoints.
 */


// src/app/_shared/services/axiosClient.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Base API URL from environment variable with Docker support
const getBaseURL = (): string => {
  const configuredURL = process.env.NEXT_PUBLIC_API_URL || "";

  // In Docker development environment, use host machine instead of service name
  if (process.env.NODE_ENV === 'development' && configuredURL.includes('backend')) {
    console.log('🔧 Docker environment detected, using host.docker.internal:8080');
    return 'http://host.docker.internal:8080'; // Use host machine where backend is accessible
  }

  // Fallback to host machine if no URL configured
  if (!configuredURL) {
    console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using host.docker.internal:8080 as fallback');
    return 'http://host.docker.internal:8080';
  }

  return configuredURL;
};


const BASE_URL = getBaseURL();

// Debug logging for environment variables
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Axios Client Configuration:', {
    originalURL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
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
  // Ensure cookies are handled properly in server-side context
  maxRedirects: 5,
  validateStatus: function (status: number) {
    return status >= 200 && status < 300; // Default
  },
  // Ensure we can access response headers including set-cookie
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
  },
};

// ----------------------
// HTTP-Only Cookie Configuration
// ----------------------
// No token bridge needed - cookies are sent automatically by browser
// Authentication is handled entirely server-side via HTTP-only cookies

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
// HTTP-Only Cookie Configuration
// ----------------------
// No token refresh queue needed - server handles authentication via cookies

// ----------------------
// Simplified Request interceptor
// ----------------------
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Enhanced logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        baseURL: config.baseURL,
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        params: config.params,
        data: config.data,
        headers: config.headers,
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
        data: response.data,
        status: response.status,
        headers: response.headers,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status || error.code} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
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

 4. Error handling:
     - 401 errors indicate invalid/expired authentication
     - Redirect to login page when authentication fails
     - No client-side token refresh needed

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