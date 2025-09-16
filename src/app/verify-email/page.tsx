"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "../shared/components/PrimaryButton";
import { AuthService } from "@/app/shared/services/AuthService"; // Import the centralized service

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-focus on code input
  useEffect(() => {
    const codeInput = document.getElementById('verification-code');
    if (codeInput) {
      codeInput.focus();
    }
  }, []);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 4) {
      setError('Please enter a 4-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await AuthService.verifyEmail(email, code);
      
      if (response.success) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 2000);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      
      // Handle different error types
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError("Invalid verification code. Please try again.");
      } else if (err.response?.status === 404) {
        setError("User not found. Please register again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setMessage('');
    
    try {
      const response = await AuthService.resendVerificationCode(email);
      
      if (response.success) {
        setMessage('New verification code sent! Please check your email.');
        setCode(''); // Clear the input
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } catch (err: any) {
      console.error("Resend error:", err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 404) {
        setError("User not found. Please register again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Only digits, max 4
    setCode(value);
    setError(''); // Clear error when user types
  };

  if (!email) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
        <div className="mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8 text-center">
            <h1 className="text-slate-900 text-2xl font-semibold mb-4">
              Invalid Access
            </h1>
            <p className="text-slate-600 mb-6">
              Please register first to verify your email.
            </p>
            <Link 
              href="/register"
              className="text-slate-900 hover:underline font-medium"
            >
              Go to Registration
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-slate-900 text-2xl font-semibold">
              Verify your email
            </h1>
            <p className="text-slate-600 mt-2 text-sm">
              We sent a 4-digit verification code to:
            </p>
            <p className="text-slate-900 font-medium mt-1">
              {email}
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerification} className="space-y-5">
            {/* Verification Code Input */}
            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-slate-900 text-center mb-2"
              >
                Enter 4-digit verification code
              </label>
              <input
                id="verification-code"
                name="code"
                type="text"
                required
                value={code}
                onChange={handleCodeChange}
                maxLength={4}
                className="block w-full text-center text-2xl font-mono tracking-widest rounded-md border border-slate-300 bg-white px-3 py-4 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="0000"
              />
              <p className="mt-1 text-xs text-slate-500 text-center">
                Check your email for the verification code
              </p>
            </div>

            {/* Verify Button */}
            <PrimaryButton type="submit" fullWidth disabled={isLoading || code.length !== 4}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </PrimaryButton>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-slate-900 hover:underline font-medium text-sm disabled:text-slate-400 disabled:no-underline"
            >
              {isResending ? "Sending..." : "Resend verification code"}
            </button>
          </div>

          {/* Back to Register */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Wrong email?{" "}
            <Link href="/register" className="text-slate-900 hover:underline">
              Register again
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailPage;