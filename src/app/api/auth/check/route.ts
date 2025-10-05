import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeJwt, isTokenExpired } from '@/app/_shared/lib/jwt';

/**
 * GET /api/auth/check
 *
 * Verifies authentication status by checking HTTP-only access token cookie.
 *
 * Security features:
 * - Validates access token from HTTP-only cookie server-side
 * - Checks token expiration and structure
 * - Returns user info without exposing tokens
 * - No tokens sent to client-side JavaScript
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Get access token from HTTP-only cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('🔍 Auth check - accessToken present:', !!accessToken);
    console.log('🔍 Auth check - accessToken length:', accessToken?.length || 0);
    console.log('🔍 Auth check - all cookies:', cookieStore.getAll().map(c => c.name));

    // No token means not authenticated
    if (!accessToken) {
      console.log('🔍 Auth check - no token found');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Decode and validate token
    const payload = decodeJwt(accessToken);
    console.log('🔍 Auth check - decoded payload:', payload);
    console.log('🔍 Auth check - accessToken preview:', accessToken.substring(0, 50) + '...');

    if (!payload) {
      console.log('🔍 Auth check - token decode failed');
      console.log('🔍 Auth check - trying manual decode...');

      // Try manual JWT decode for debugging
      try {
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          const payloadPart = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = atob(payloadPart);
          console.log('🔍 Auth check - manual decode result:', JSON.parse(jsonPayload));
        }
      } catch (manualError) {
        console.error('🔍 Auth check - manual decode also failed:', manualError);
      }

      return NextResponse.json(
        { authenticated: false, error: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      console.log('🔍 Auth check - token expired');
      return NextResponse.json(
        { authenticated: false, error: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    } else {
      console.log('🔍 Auth check - token not expired');
    }

    // Validate required fields
    console.log('🔍 Auth check - payload fields:', {
      role: payload.role,
      sub: payload.sub,
      email: payload.email,
      exp: payload.exp,
      iat: payload.iat
    });

    if (!payload.role || !payload.sub || !payload.email) {
      console.log('🔍 Auth check - missing required fields');
      return NextResponse.json(
        { authenticated: false, error: 'INVALID_TOKEN_PAYLOAD' },
        { status: 401 }
      );
    }

    // Token is valid - return user info (no token exposure!)
    console.log('🔍 Auth check - token valid, returning user info');
    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        is_verified: payload.is_verified,
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    console.error('Auth check error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { authenticated: false, error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}