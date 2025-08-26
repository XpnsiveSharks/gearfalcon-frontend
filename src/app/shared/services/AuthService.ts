/*
*************************** overview of AuthService ***************************
1. Centralized API calls for authentication
	- AuthService provides functions for login and token refresh.
	- All requests go through a single Axios instance (authHttp) with base URL and credentials configured.
2. Login function
	- `login(email, password)` calls the API to authenticate the user.
	- Returns both access token (short-lived) and refresh token (long-lived, stored in HTTP-only cookie).
	- Access token is meant for frontend use, refresh token is handled securely by the backend.
3. Refresh function
	- `refresh()` calls the API to get a new access token using the refresh token.
	- Refresh token is sent automatically via HTTP-only cookie; frontend never accesses it.
	- Returns only the new access token to update in-memory state.
4. Safe and reusable
	- Keeps refresh token secure in the backend.
	- Centralizes auth API logic for easy reuse across the app.
Usage summary:
	- Call `AuthService.login()` to log in and store access token.
	- Call `AuthService.refresh()` when a 401 occurs to get a new access token.
	- Works together with AuthProvider and axiosClient for automatic token management.
*/


import axios from "axios"; // Import Axios for making HTTP requests

// Type definition for login response
export type LoginResponse = {
	access_token: string;   								// Short-lived access token for API requests
	refresh_token: string;  								// Long-lived refresh token
};


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";		// Base URL for API requests, read from environment variable

// Create an Axios instance for auth-related requests
const authHttp = axios.create({
	baseURL: BASE_URL,       	// All requests use this base URL
	withCredentials: true,   	// Include cookies (important for refresh token in cookie)
});

// AuthService contains functions for login and token refresh
export const AuthService = {
	// Login function: calls API with email/password
	async login(email: string, password: string): Promise<LoginResponse> {
		// POST request to login endpoint
		const { data } = await authHttp.post<LoginResponse>("/api/auth/login", { email, password });
		return data; 			// Returns both access_token and refresh_token
	},

	// Refresh function: calls API to get a new access token using refresh token (cookie)
	async refresh(): Promise<{ access_token: string }> {
		// POST request to refresh endpoint
		const { data } = await authHttp.post<{ access_token: string }>("/api/auth/refresh", {});
		return data; 			// Returns new access_token
	},
};

