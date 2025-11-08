import React from "react";
import PrimaryButton from "@/app/_shared/components/PrimaryButton";
import { Eye, EyeOff } from "lucide-react";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  step: number;
  isLoading: boolean;
  handleRequestCodeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleResetPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  code,
  setCode,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  step,
  isLoading,
  handleRequestCodeSubmit,
  handleResetPasswordSubmit,
}) => {
  if (step === 1) {
    return (
      <form
        className="mt-6 space-y-5"
        onSubmit={handleRequestCodeSubmit}
        noValidate
      >
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
          />
        </div>
        <PrimaryButton type="submit" isLoading={isLoading} fullWidth>
          Send Reset Code
        </PrimaryButton>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form
        className="mt-6 space-y-5"
        onSubmit={handleResetPasswordSubmit}
        noValidate
      >
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-slate-900"
          >
            Reset Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="123456"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-900"
          >
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Your new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
        </div>
        <PrimaryButton type="submit" isLoading={isLoading} fullWidth>
          Reset Password
        </PrimaryButton>
      </form>
    );
  }

  return null;
};

export default ForgotPasswordForm;
