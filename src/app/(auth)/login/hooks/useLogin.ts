/*
*************************** useLogin hook Overview ***************************
1. Encapsulates login logic:
   - Provides a single function `handleLogin` that takes email and password.
   - Calls the AuthService API to authenticate the user.

2. Manages UI state:
   - Tracks loading status (`isLoading`) during the login request.
   - Stores error messages (`error`) if login fails.

3. Updates global authentication state:
   - Uses `setAccessToken` from AuthContext to store the access token in memory.
   - Ensures other parts of the app know the user is authenticated.

4. Simplifies usage in components:
   - Components can call `handleLogin` and respond to `isLoading` or `error`.
   - Keeps login API logic separated from UI code.

5. Safe pattern:
   - Refresh token is handled by the backend and not exposed to frontend.
   - Only the access token is stored in memory.
*/

"use client"; // Marks this file as a client-side React component in Next.js

import { useState } from "react"; 
// React hook for managing local component state

import { useAuth } from "@/app/_shared/hooks/useAuth";
// Custom hook that provides access to AuthContext (like setAccessToken)
import { useRouter } from "next/navigation";
import axios from "axios";

// Custom hook to handle login logic
export function useLogin() {
	// Local state to track loading status during login
	const [isLoading, setIsLoading] = useState(false);

	// Local state to store login error messages
	const [error, setError] = useState<string | null>(null);

	// Get setter for authentication state from AuthContext
	const { setIsAuthenticated, setUser } = useAuth();
	const router = useRouter();

	// Helper function to get dashboard URL based on user role
	const getDashboardUrl = (role: string): string => {
		console.log('🔍 getDashboardUrl called with role:', role);
		console.log('🔍 Role type:', typeof role);

		if (!role) {
			console.error('❌ No role provided to getDashboardUrl');
			return '/';
		}

		const normalizedRole = String(role).toLowerCase().trim();
		console.log('🔍 Normalized role:', normalizedRole);

		switch (normalizedRole) {
			case 'admin':
				console.log('🔍 Returning admin dashboard');
				return '/admin';
			case 'customer':
				console.log('🔍 Returning customer dashboard');
				return '/customer';
			case 'technician':
				console.log('🔍 Returning technician dashboard');
				return '/technician';
			default:
				console.error('❌ Unknown role:', normalizedRole);
				return '/'; // Fallback to home page for unknown roles
		}
	};

	// Function to handle login with email and password
	const handleLogin = async (email: string, password: string) => {
		setError(null);       // Clear previous errors
		setIsLoading(true);   // Start loading

		try {
			// Call the Next.js API route (which sets HTTP-only cookies)
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				// Handle different error types
				if (response.status === 403) {
					setError("Please verify your email. We sent you a new code.");
					router.push(`/verify-email?email=${encodeURIComponent(email)}`);
					return false;
				}

				if (response.status === 401) {
					setError("Invalid email or password");
					return false;
				}

				setError(data.message || "Login failed");
				return false;
			}

			// Login successful - token is now stored in HTTP-only cookie
			// Update authentication state for UI purposes
			setIsAuthenticated(true);
			setUser(data.user); // Immediately update the user in the context

			// Debug: Log the user data and role
			console.log('🔍 Login successful, user data:', data);
			console.log('🔍 User role:', data.user.role);

			// Automatically redirect to role-based dashboard with fallback mechanism
			const dashboardUrl = getDashboardUrl(data.user.role);
			console.log('🔍 Redirecting to dashboard:', dashboardUrl);

			// Use a more reliable redirect mechanism
			const performRedirect = async () => {
				try {
					console.log('🔄 Starting redirect to:', dashboardUrl);

					// Wait for auth state to fully propagate
					await new Promise(resolve => setTimeout(resolve, 150));

					// Use router.push for client-side navigation
					console.log('🔄 Using router.push for client-side navigation');
					router.push(dashboardUrl);

					// Wait and check if navigation actually happened
					await new Promise(resolve => setTimeout(resolve, 300));

					if (window.location.pathname !== '/login') {
						console.log('✅ Router.push succeeded');
						return true;
					} else {
						console.log('❌ Router.push failed, trying window.location');
						// Fallback to window.location if router.push fails
						window.location.href = dashboardUrl;
						return true;
					}
				} catch (redirectError) {
					console.error('❌ Redirect error:', redirectError);
					// Final fallback
					window.location.href = dashboardUrl;
					return true;
				}
			};

			await performRedirect();

			// Return success
			return true;
		} catch (err: any) {
			console.error("Login error:", err);
			setError("Network error. Please check your connection and try again.");
			return false;
		} finally {
			// Stop loading regardless of success or failure
			setIsLoading(false);
		}
	};

	// Return login function and states to consuming component
	return { handleLogin, isLoading, error };
}

/* 
How to use this hook:

1. Import it in a React component:
   import { useLogin } from "./hooks/useLogin";
2. Use the hook inside a component:
   const { handleLogin, isLoading, error } = useLogin();
3. Example usage in a form submit:
   const onSubmit = async () => {
     try {
       await handleLogin(email, password);
       // Redirect user or show success
     } catch (_) {
       // Error is already handled in `error` state
     }
   }
*/
