import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * POST /api/auth/refresh
 *
 * Refreshes the access token using the HTTP-only refresh token cookie.
 * Calls the backend authentication service to generate new tokens.
 *
 * Security features:
 * - Validates refresh token exists
 * - Calls backend auth service (doesn't generate tokens on Next.js)
 * - Sets new access token as HTTP-only cookie only
 * - Never exposes tokens to client-side JavaScript
 */
export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    // Get the refresh token from HTTP-only cookie
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Check if refresh token exists
    if (!refreshToken) {
      return NextResponse.json(
        {
          error: 'NO_REFRESH_TOKEN',
          message: 'No refresh token provided'
        },
        { status: 401 }
      );
    }

    // Call backend auth service to refresh token
    const backendURL = process.env.NEXT_PUBLIC_API_URL;
    const backendResponse = await fetch(`${backendURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`
      }
    });

    // Handle backend errors
    if (!backendResponse.ok) {
      console.error('Backend refresh failed:', backendResponse.status);

      // Clear invalid refresh token cookie
      const errorResponse = NextResponse.json(
        {
          error: 'REFRESH_FAILED',
          message: 'Unable to refresh access token'
        },
        { status: 401 }
      );

      errorResponse.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      errorResponse.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return errorResponse;
    }

    // Get new access token from backend
    const data = await backendResponse.json();

    // Create success response (no token in body!)
    const successResponse = NextResponse.json({ success: true });

    // Set new access token as HTTP-only cookie
    successResponse.cookies.set('accessToken', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    return successResponse;

  } catch (error: any) {
    console.error('Refresh endpoint error:', error);

    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during token refresh'
      },
      { status: 500 }
    );
  }
}