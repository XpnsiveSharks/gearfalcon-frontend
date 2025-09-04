"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "../shared/components/PrimaryButton";
import PasswordStrengthIndicator from "../shared/components/PasswordStrenghtIndicator";

const RegisterPage = () => {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // mock register handler (replace with API call later)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: call backend API (admin or customer registration)
    console.log("Registering user:", { email, password });
    router.push("/login");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          <h1 className="text-slate-900 text-2xl font-semibold">
            Create an account
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Register as an Admin or Customer to get started.
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-5">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Password with strength indicator */}
            <PasswordStrengthIndicator
              password={password}
              onPasswordChange={setPassword}
              required
              userType="customer"
              showGenerator
              showRequirements
            />

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-900"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Re-enter password"
              />
            </div>

            {/* Submit */}
            <PrimaryButton type="submit" fullWidth>
              Register
            </PrimaryButton>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
