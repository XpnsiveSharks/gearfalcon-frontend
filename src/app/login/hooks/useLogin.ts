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

import { AuthService } from "../../shared/services/AuthService"; 
// Service that handles API calls for authentication (e.g., login)

import { useAuth } from "../../shared/hooks/useAuth"; 
// Custom hook that provides access to AuthContext (like setAccessToken)

// Custom hook to handle login logic
export function useLogin() {
	// Local state to track loading status during login
	const [isLoading, setIsLoading] = useState(false);

	// Local state to store login error messages
	const [error, setError] = useState<string | null>(null);

	// Get setter for access token from AuthContext
	const { setAccessToken } = useAuth();

	// Function to handle login with email and password
	const handleLogin = async (email: string, password: string) => {
		setError(null);       // Clear previous errors
		setIsLoading(true);   // Start loading

		try {
			// Call the AuthService login API
			const { access_token } = await AuthService.login(email, password);

			// Store the access token in AuthContext
			setAccessToken(access_token);

			// Return success
			return true;
		} catch (err) {
			// Set error state if login fails
			setError("Invalid credentials");

			// Re-throw error for additional handling if needed
			throw err;
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
