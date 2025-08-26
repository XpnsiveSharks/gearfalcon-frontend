
/*
*************************** AuthProvider and useAuth Overview ***************************
1. Centralized authentication state
	- AuthProvider stores the access token in memory.
	- Provides a consistent way for any component to know if the user is logged in (isAuthenticated).
2. Access token management
	- Exposes setAccessToken to update the token after login or refresh.
	- Exposes logout to clear the token and effectively log the user out.
	- Integrates with the Axios client to attach the token to API requests automatically.
3. React Context for global access
	- useAuth hook allows any child component to access auth state without prop drilling.
	- Ensures that only components within AuthProvider can use the auth context.
4. Optimized for performance
	- Uses useMemo to avoid unnecessary re-renders when auth state changes.
	- Uses useCallback for setter and logout functions to prevent re-creation on each render.
5. Safe and simple usage
	- Frontend only accesses the access token in memory.
	- Refresh token is handled securely by the backend (not exposed to frontend).
Usage summary:
	- Wrap your app with <AuthProvider>.
	- Use useAuth() in any child component to get accessToken, isAuthenticated, setAccessToken, and logout.
	- Works seamlessly with the Axios client for automatic token handling and refresh.
*/

"use client"; // This tells Next.js that this component should be rendered on the client side

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// Importing React hooks: 
// - createContext: to create a context for auth state
// - useCallback: memoizes functions to avoid unnecessary re-renders
// - useContext: consumes the context
// - useEffect: side-effects (like registering token access)
// - useMemo: memoizes values for performance
// - useState: local component state

import { registerTokenAccess } from "@/app/shared/services/axiosClient";
// Importing a function that registers the token with Axios client for API requests

// Define the shape of the AuthContext value
export type AuthContextValue = {
	accessToken: string | null; 					// The JWT or access token for API requests
	isAuthenticated: boolean;						// Derived boolean indicating if user is logged in
	setAccessToken: (token: string | null) => void;	// Setter function to update token
	logout: () => void;								// Function to clear token and log out
};

// Create the context. Initially undefined, so we can check if provider is used correctly.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	// Local state to store access token
	const [accessToken, setAccessTokenState] = useState<string | null>(null);
	// Memoized setter for the access token to avoid re-creating the function on each render
	const setAccessToken = useCallback((token: string | null) => {
		setAccessTokenState(token);
	}, []);
	// Memoized logout function that clears the token
	const logout = useCallback(() => {
		setAccessTokenState(null);
	}, []);

	// Effect to register the token with your Axios client whenever it changes
	useEffect(() => {
		// registerTokenAccess accepts a getter for current token and a setter for updating it
		registerTokenAccess(
			() => accessToken,												// Provide current token when Axios makes requests
			(newToken: string | null) => setAccessTokenState(newToken)		// Update token if Axios refreshes it
		);
	}, [accessToken]);

	// Memoize the value object so consumers don’t re-render unnecessarily
	const value = useMemo<AuthContextValue>(
		() => ({
			accessToken,
			isAuthenticated: Boolean(accessToken),		// true if token exists
			setAccessToken,
			logout,
		}),
		[accessToken, setAccessToken, logout]			// recompute value only when these change
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