"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/_shared/hooks/useAuth";
import { useRouter } from "next/navigation";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout, isLoading, user } = useAuth();
    const router = useRouter();

    // Debug authentication state changes
    console.log('🔄 Navbar auth state:', {
        isAuthenticated,
        isLoading,
        user: user ? { role: user.role, email: user.email } : null
    });

  // Get user information from auth context (no token decoding needed)
  const userInfo = {
    name: user?.name || null,
    email: user?.email || null,
    role: user?.role || null,
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API to clear HTTP-only cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear client-side auth state
    logout();

    // Redirect to home page
    router.push("/");
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    const role = userInfo?.role?.toLowerCase();
    if (role === "admin") return "/admin";
    if (role === "customer") return "/customer";
    if (role === "technician") return "/technician";
    return "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-100 text-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold">
              GearFalcon
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Show public links only for non-authenticated users */}
            {!isAuthenticated && (
              <>
                <Link href="/pricing" className="hover:opacity-80 transition-opacity">
                  Pricing
                </Link>
                <Link href="/#services" className="hover:opacity-80 transition-opacity">
                  Our Services
                </Link>
                <Link href="/about" className="hover:opacity-80 transition-opacity">
                  About
                </Link>
                <Link href="/contact" className="hover:opacity-80 transition-opacity">
                  Contact
                </Link>
              </>
            )}

            {/* Dynamic Auth Section */}
            {isLoading ? (
              <div className="w-32 h-8 bg-slate-200 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{userInfo?.name || userInfo?.email}</span>
                  {userInfo?.role && (
                    <span className="ml-2 px-2 py-1 bg-slate-200 rounded text-xs uppercase">
                      {userInfo.role}
                    </span>
                  )}
                </div>

                {/* Dashboard Link */}
                <Link
                  href={getDashboardLink()}
                  className="bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="space-y-1 px-4 py-3">
            {/* Show public links only for non-authenticated users */}
            {!isAuthenticated && (
              <>
                <Link href="/pricing" className="block py-2 hover:opacity-80">
                  Pricing
                </Link>
                <Link href="/#services" className="block py-2 hover:opacity-80">
                  Our Services
                </Link>
                <Link href="/about" className="block py-2 hover:opacity-80">
                  About
                </Link>
                <Link href="/contact" className="block py-2 hover:opacity-80">
                  Contact
                </Link>
              </>
            )}

            {/* Dynamic Mobile Auth */}
            {isLoading ? (
              <div className="w-full h-8 bg-slate-200 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <>
                {/* User Info in Mobile */}
                <div className="py-2 text-sm text-slate-600 border-b border-slate-200">
                  <div className="font-medium">{userInfo?.name || userInfo?.email}</div>
                  {userInfo?.role && (
                    <span className="inline-block mt-1 px-2 py-1 bg-slate-200 rounded text-xs uppercase">
                      {userInfo.role}
                    </span>
                  )}
                </div>

                <Link
                  href={getDashboardLink()}
                  className="block py-3 bg-slate-200 hover:bg-slate-300 rounded-md text-center font-medium mt-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium mt-2 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-center mt-2 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;