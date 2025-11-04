/*
 *************************** Enhanced AuthService ***************************
 1. Centralized API calls for ALL authentication (including registration)
 2. Consistent endpoint structure and error handling
 3. Proper TypeScript types for all auth operations
 4. Uses centralized axios client for consistent behavior
 */

import { http } from "./axiosClient";

// Type definitions for API responses
export type LoginResponse = {
  success: boolean;
  access_token: string;      // ← Now included from backend
  refresh_token: string;     // ← Now included from backend
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    is_verified: number | boolean; // Backend returns 1/0, but we convert to boolean
  };
  _headers?: any; // Internal field for headers (not from backend)
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

// AuthService with all authentication operations
export const AuthService = {
  // Login function
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔐 AuthService: Attempting login for', email);
    console.log('🔗 AuthService: Using baseURL', http.defaults.baseURL);

    try {
      const response = await http.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      console.log('✅ AuthService: Login successful');
      console.log('🔧 AuthService: Response headers:', response.headers);
      console.log('🔧 AuthService: Set-Cookie header:', response.headers['set-cookie']);

      // Return both data and headers for cookie handling
      return {
        ...response.data,
        _headers: response.headers
      } as LoginResponse & { _headers: any };
    } catch (error: any) {
      console.error('❌ AuthService login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: http.defaults.baseURL,
      });
      throw error;
    }
  },

  // Token refresh function (calls backend /auth/refresh endpoint)
  // Note: This is different from the frontend /api/auth/refresh endpoint
  // The frontend endpoint is called automatically by useAuth on mount
  async refresh(): Promise<{ access_token: string }> {
    const { data } = await http.post<{ access_token: string }>(
      "/auth/refresh",
      {}
    );
    return data;
  },

  // Frontend refresh check (used by useAuth hook)
  // This calls the Next.js API route which handles httpOnly refresh token cookies
  async checkAuthStatus(): Promise<{ access_token: string } | null> {
    try {
      const { data } = await http.post<{ access_token: string }>(
        "/auth/refresh",
        {}
      );
      return data;
    } catch (error) {
      console.error("Auth status check failed:", error);
      return null;
    }
  },
  // Registration function
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    console.log('🔐 AuthService: Attempting registration for', userData.email);
    console.log('🔗 AuthService: Using baseURL', http.defaults.baseURL);

    const { data } = await http.post<RegisterResponse>("/auth/register", {
      ...userData,
      role: userData.role || "customer",
    });

    console.log('✅ AuthService: Registration successful');
    return data;
  },

  // Email verification function
  async verifyEmail(
    email: string,
    verificationCode: string
  ): Promise<VerifyEmailResponse> {
    const { data } = await http.post<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        email,
        verification_code: verificationCode,
      }
    );
    return data;
  },

  // Resend verification code function
  async resendVerificationCode(
    email: string
  ): Promise<ResendVerificationResponse> {
    const { data } = await http.post<ResendVerificationResponse>(
      "/auth/resend-verification",
      {
        email,
      }
    );
    return data;
  },

  // Debug function - remove in production
  async testEmailConfig(): Promise<any> {
    const { data } = await http.get("/debug/email-config");
    return data;
  },

  async forgotPassword(email: string): Promise<any> {
    const { data } = await http.post("/auth/forgot-password", { email });
    return data;
  },

  async verifyPasswordReset(email: string, code: string): Promise<any> {
    const { data } = await http.post("/auth/verify-password-reset", {
      email,
      code,
    });
    return data;
  },

  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<any> {
    const { data } = await http.post("/auth/reset-password", {
      email,
      code,
      password,
    });
    return data;
  },
};
