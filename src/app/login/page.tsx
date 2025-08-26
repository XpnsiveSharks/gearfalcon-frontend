/*
*************************** LoginPage Component Overview ***************************
1. Reusable login form
	- LoginPage renders a reusable login form with email and password fields.
	- You can place it on any route that requires user authentication.
	- Uses local state (useState) to manage form inputs and UI states like showPassword.
2. Handles login logic
	- Integrates with the useLogin hook to call the backend login API.
	- Updates the access token in memory using the AuthProvider context.
	- Displays loading state (isLoading) while the request is in progress.
	- Shows error messages if login fails.
3. Automatic navigation on success
	- On successful login, it redirects the user to /features using Next.js useRouter.
	- No need to manually handle redirect logic in multiple components.
*/

"use client"; 
// This Next.js directive ensures the component is rendered on the client side

import React, { useState } from "react";
import PrimaryButton from "../shared/components/PrimaryButton"; 
// Custom button component with loading state
import { useLogin } from "./hooks/useLogin"; 
// Custom hook to handle login logic (calls API, updates access token)
import { useRouter } from "next/navigation"; 
// Next.js router for client-side navigation

const LoginPage = () => {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility

  const router = useRouter(); // Next.js router

  // Get login handler and status from custom hook
  const { handleLogin, isLoading, error } = useLogin();

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload
    const ok = await handleLogin(email, password); // call login API
    if (ok) {
      router.replace("/features"); // redirect to features page on success
    }
  };
 
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          <h1 className="text-slate-900 text-2xl font-semibold">
            Welcome back
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Please sign in to continue.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="you@example.com"
                aria-describedby="email-help"
              />
              <p id="email-help" className="mt-1 text-xs text-slate-500">
                Use the email you registered with.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-900"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-600 hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 6.244 18 12 18c1.658 0 3.11-.262 4.35-.72M6.228 6.228A10.45 10.45 0 0112 6c5.756 0 8.774 2.662 10.066 6-.37.98-.913 1.877-1.6 2.646M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 5 12 5c4.638 0 8.573 2.507 9.963 6.683.07.207.07.429 0 .636C20.573 16.49 16.64 19 12 19c-4.638 0-8.573-2.507-9.963-6.678z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm text-slate-900 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <PrimaryButton type="submit" isLoading={isLoading} fullWidth>
              Sign in
            </PrimaryButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-slate-900 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

/* 
*************************** How to use this component: ***************************
1. Place it in a Next.js page, e.g. `app/login/page.tsx`.
2. It renders a login form with email and password fields.
3. It uses `useLogin` hook to handle API call and store access token in context.
4. On successful login, it redirects to `/features`.
*/