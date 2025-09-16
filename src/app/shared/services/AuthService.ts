/*
*************************** Enhanced AuthService ***************************
1. Centralized API calls for ALL authentication (including registration)
2. Consistent endpoint structure and error handling
3. Proper TypeScript types for all auth operations
4. Single Axios instance with proper configuration
*/

import axios from "axios";

// Type definitions for API responses
export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
  };
  next_step: string;
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
};

export type ResendVerificationResponse = {
  success: boolean;
  message: string;
};

// Registration request data
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://gearfalcon.test";

// Create an Axios instance for all auth-related requests
const authHttp = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for consistent error handling
authHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('Auth API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    
    return Promise.reject(error);
  }
);

// AuthService with all authentication operations
export const AuthService = {
  // Login function
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await authHttp.post<LoginResponse>("/api/auth/login", { 
      email, 
      password 
    });
    return data;
  },

  // Token refresh function
  async refresh(): Promise<{ access_token: string }> {
    const { data } = await authHttp.post<{ access_token: string }>("/api/auth/refresh", {});
    return data;
  },

  // Registration function
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await authHttp.post<RegisterResponse>("/auth/register", {
      ...userData,
      role: userData.role || "customer"
    });
    return data;
  },

  // Email verification function
  async verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
    const { data } = await authHttp.post<VerifyEmailResponse>("/auth/verify-email", {
      email,
      code
    });
    return data;
  },

  // Resend verification code function
  async resendVerificationCode(email: string): Promise<ResendVerificationResponse> {
    const { data } = await authHttp.post<ResendVerificationResponse>("/auth/resend-verification", {
      email
    });
    return data;
  },

  // Debug function - remove in production
  async testEmailConfig(): Promise<any> {
    const { data } = await authHttp.get("/debug/email-config");
    return data;
  }
};