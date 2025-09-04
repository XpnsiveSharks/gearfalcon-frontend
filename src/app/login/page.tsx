"use client";

import React, { useState } from "react";
import PrimaryButton from "../shared/components/PrimaryButton";
import { useLogin } from "./hooks/useLogin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // ✅ import from lucide-react

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { handleLogin, isLoading, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const ok = await handleLogin(email, password);
        if (ok) router.replace("/features");
      } catch {
        // error state is set inside useLogin; no-op here
    }
 };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          <h1 className="text-slate-900 text-2xl font-semibold">Welcome back</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Please sign in to continue.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email */}
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

            {/* Password */}
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
                    <EyeOff className="w-5 h-5" /> 
                  ) : (
                    <Eye className="w-5 h-5" />
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

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <PrimaryButton type="submit" isLoading={isLoading} fullWidth>
              Sign in
            </PrimaryButton>
          </form>

          {/* ✅ Use Next.js Link for Register page */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-slate-900 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
