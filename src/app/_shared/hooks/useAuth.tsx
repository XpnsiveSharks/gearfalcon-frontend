/*
 *************************** Secure HTTP-Only Cookie AuthProvider ***************************
 1. Secure authentication state management
  	- No token storage in client-side memory (maximum security)
  	- Server-side authentication verification via API calls
  	- Provides authentication status without exposing sensitive tokens
 2. HTTP-only cookie integration
  	- Uses secure HTTP-only cookies for token storage
  	- Automatic credential handling for API requests
  	- Server-side token validation and refresh
 3. React Context for global access
  	- useAuth hook provides authentication state without prop drilling
  	- Ensures secure authentication state management across the app
  	- Includes user information from server-side validation
 4. Optimized for security and UX
  	- Uses useMemo to avoid unnecessary re-renders
  	- Uses useCallback for logout function to prevent re-creation
  	- Provides isLoading state for initial auth check
 5. Maximum security authentication
  	- No tokens exposed to client-side JavaScript
  	- Protected against XSS attacks via HTTP-only cookies
  	- Server-side validation for all authentication checks
  Enhanced Usage summary:
  	- Wrap your app with <AuthProvider>.
  	- Use useAuth() to get isAuthenticated, isLoading, user, setIsAuthenticated, and logout.
  	- Authentication verified server-side via /api/auth/check endpoint.
  	- Works with HTTP-only cookies and automatic credential handling.
 */

"use client"; // This tells Next.js that this component should be rendered on the client side

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Importing React hooks:
// - createContext: to create a context for auth state
// - useCallback: memoizes functions to avoid unnecessary re-renders
// - useContext: consumes the context
// - useEffect: side-effects (like registering token access and initial auth check)
// - useMemo: memoizes values for performance
// - useState: local component state

import { AuthService } from "@/app/_shared/services/AuthService";
// AuthService for any remaining auth operations

// Define the shape of the AuthContext value
export type AuthContextValue = {
  isAuthenticated: boolean; // Boolean indicating if user is logged in
  isLoading: boolean; // Loading state for initial auth check
  setIsAuthenticated: (authenticated: boolean) => void; // Setter function to update auth state
  setUser: (user: AuthContextValue['user']) => void; // Setter for user data
  logout: () => void; // Function to clear authentication and log out
  user?: {
    id: string;
    name?: string;
    email: string;
    role: string;
    is_verified?: boolean;
  } | null; // User information from server
};

// Create the context. Initially undefined, so we can check if provider is used correctly.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Authentication state - no longer stores tokens
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  // Loading state to track initial authentication check
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Track when authentication was last set to prevent conflicts
  const [lastAuthUpdate, setLastAuthUpdate] = useState<number>(0);

  // Enhanced logout function that calls API to clear cookies
  const logout = useCallback(async () => {
    try {
      // Call logout API to clear HTTP-only cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear client-side state
    setIsAuthenticated(false);
    setUser(null);
    setLastAuthUpdate(Date.now());
  }, []);

  // Enhanced setIsAuthenticated that tracks updates
  const setIsAuthenticatedWithTimestamp = useCallback((authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    setLastAuthUpdate(Date.now());
  }, []);

  // Effect to check authentication status on mount
  useEffect(() => {
    // Skip auth check if we're already authenticated (prevents overriding login)
    if (isAuthenticated) {
      console.log('🔍 Already authenticated, skipping auth check');
      setIsLoading(false);
      return;
    }

    // Also skip if we're in the middle of a login process
    // Check if we're on the login page
    if (typeof window !== "undefined" && window.location.pathname === '/login') {
      console.log('🔍 On login page, skipping auth check to avoid conflicts');
      setIsLoading(false);
      return;
    }

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);

        // Call our new auth check API (server-side validation)
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        console.log('🔍 Auth check response:', { status: response.status, data });

        if (response.ok && data.authenticated) {
          // Only update if this is a fresh auth check (not overriding recent login)
          const timeSinceLastUpdate = Date.now() - lastAuthUpdate;
          if (timeSinceLastUpdate > 5000) { // Only override if last update was > 5 seconds ago
            console.log('🔍 Setting authenticated from auth check');
            setIsAuthenticated(true);
            setUser(data.user);
            setLastAuthUpdate(Date.now());
          } else {
            console.log('🔍 Recent auth update detected, preserving existing state');
          }
        } else {
          // Only set to false if this is a fresh auth check
          const timeSinceLastUpdate = Date.now() - lastAuthUpdate;
          if (timeSinceLastUpdate > 5000) {
            console.log('🔍 Setting not authenticated from auth check');
            setIsAuthenticated(false);
            setUser(null);
            setLastAuthUpdate(Date.now());
          } else {
            console.log('🔍 Recent auth update detected, not overriding to false');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        console.log('🔍 Setting not authenticated due to error');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run the check if we're in a browser environment
    if (typeof window !== "undefined") {
      checkAuthStatus();
    } else {
      // Server-side rendering, skip auth check
      setIsLoading(false);
    }
  }, []); // Empty dependency array - only run on mount

  // Memoize the value object so consumers don’t re-render unnecessarily
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      setUser,
      setIsAuthenticated: setIsAuthenticatedWithTimestamp,
      logout,
    }),
    [isAuthenticated, isLoading, user, setUser, setIsAuthenticatedWithTimestamp, logout]
  );

  // Provide the AuthContext to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the AuthContext easily
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // This ensures that useAuth is used inside AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
