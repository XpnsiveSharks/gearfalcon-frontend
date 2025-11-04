"use client";

import React, { useState } from "react";
import PrimaryButton from "@/app/_shared/components/PrimaryButton";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useForgotPassword } from "./hooks/useForgotPassword";

import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    isLoading,
    error,
    successMessage,
    step,
    handleRequestCode,
    handleResetPassword,
  } = useForgotPassword();

  const handleRequestCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleRequestCode(email);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleResetPassword(email, code, password);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          {step !== 3 && (
            <>
              <h1 className="text-slate-900 text-2xl font-semibold">
                {step === 1 ? "Forgot Password" : "Reset Password"}
              </h1>
              <p className="text-slate-600 mt-1 text-sm">
                {step === 1
                  ? "Enter your email to receive a password reset code."
                  : "Enter the code and your new password."}
              </p>
            </>
          )}

          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            code={code}
            setCode={setCode}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            step={step}
            isLoading={isLoading}
            handleRequestCodeSubmit={handleRequestCodeSubmit}
            handleResetPasswordSubmit={handleResetPasswordSubmit}
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
            >
              {successMessage}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link href="/login" className="text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
