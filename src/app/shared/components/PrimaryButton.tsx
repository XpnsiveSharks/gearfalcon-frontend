"use client";

import React from "react";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  fullWidth?: boolean;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors";
  const width = fullWidth ? " w-full" : "";

  return (
    <button
      className={`${base}${width} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;


