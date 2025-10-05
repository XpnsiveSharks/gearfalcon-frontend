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
 * - Validates login credentials with backend (localhost:8080/auth/login)
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

    // Call backend login API (localhost:8080/auth/login)
    console.log('🔐 Attempting login for:', email);
    console.log('🔗 Backend URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

    const loginResponse: LoginResponse = await AuthService.login(email, password);
    console.log('✅ Backend login successful');

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
      // ⚠️ CRITICAL: NO tokens in response body for security!
    });

    // Set access token as HTTP-only cookie
    if (loginResponse.access_token) {
      console.log('🍪 Setting access_token cookie');
      
      response.cookies.set('access_token', loginResponse.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: loginResponse.expires_in || 900, // Use backend expiry
        path: '/',
      });
      
      console.log(`✅ Access token cookie set (expires in ${loginResponse.expires_in}s)`);
    } else {
      console.error('❌ No access_token in backend response');
    }

    // Set refresh token as HTTP-only cookie
    if (loginResponse.refresh_token) {
      console.log('🍪 Setting refresh_token cookie');
      
      response.cookies.set('refresh_token', loginResponse.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Stricter for refresh token
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
      
      console.log('✅ Refresh token cookie set (7 days)');
    } else {
      console.warn('⚠️ No refresh_token in backend response');
    }

    console.log('✅ Login completed successfully');
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