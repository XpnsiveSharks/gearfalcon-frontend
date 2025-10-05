import { NextRequest, NextResponse } from 'next/server';
import { AuthService, type LoginResponse } from '@/app/_shared/services/AuthService';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginApiResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
  };
  message?: string;
}

/**
 * POST /api/auth/login
 *
 * Handles user login and sets HTTP-only cookies for tokens.
 *
 * Security features:
 * - Validates login credentials with backend
 * - Sets access token as HTTP-only cookie (server-side accessible)
 * - Sets refresh token as HTTP-only cookie (server-side only)
 * - Returns user data WITHOUT exposing tokens to client (maximum security)
 */
export async function POST(request: NextRequest): Promise<NextResponse<LoginApiResponse | { error: string; message: string }>> {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Call backend login API
    console.log('🔐 Attempting login for:', email);
    console.log('🔗 Backend URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

    const loginResponse: LoginResponse = await AuthService.login(email, password);
    console.log('✅ Backend login successful');
    console.log('🔍 Login response:', JSON.stringify(loginResponse, null, 2));

    // Create response with user data (NO token exposure!)
    const response = NextResponse.json({
      success: true,
      user: {
        id: loginResponse.user.id,
        name: loginResponse.user.name,
        email: loginResponse.user.email,
        role: loginResponse.user.role,
        is_verified: Boolean(loginResponse.user.is_verified), // Convert 1/0 to boolean
      }
      // ⚠️ CRITICAL: NO access_token in response body for security!
    });

    // Forward HTTP-only cookies from backend response to client
    // This is essential for maintaining authentication state
    if (loginResponse._headers && loginResponse._headers['set-cookie']) {
      console.log('🔧 Setting HTTP-only cookies from backend');
      console.log('🔧 Cookie details:', loginResponse._headers['set-cookie']);
      loginResponse._headers['set-cookie'].forEach((cookie: string) => {
        console.log('🔧 Setting cookie:', cookie.substring(0, 100) + '...');

        response.headers.append('set-cookie', cookie);
      });
    } else {
      console.log('⚠️ No cookies received from backend');
      console.log('🔍 Available headers:', Object.keys(loginResponse._headers || {}));
      if (loginResponse._headers) {
        console.log('🔍 All headers:', loginResponse._headers);
      }
    }

    // Set refresh token as HTTP-only cookie (server-side only)
    // Note: This would need to be set by the backend in a real implementation
    // For now, we'll rely on the existing refresh token mechanism

    return response;

  } catch (error: any) {
    console.error('❌ Login API error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });

    // Handle backend API errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          error: 'ACCOUNT_NOT_VERIFIED',
          message: 'Please verify your email address before logging in'
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during login'
      },
      { status: 500 }
    );
  }
}