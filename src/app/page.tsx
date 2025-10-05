"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/_shared/hooks/useAuth";
import Hero from "@/app/_shared/components/Hero";
import Services from "@/app/_shared/components/Services";
import HowItWorks from "@/app/_shared/components/HowItWorks";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
     if (!user?.role) return "/login";
     const role = user.role.toLowerCase();

     if (role === "admin") return "/admin";
     if (role === "customer") return "/customer";
     if (role === "technician") return "/technician";
     return "/login";
   };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] pt-24 px-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show appropriate content based on authentication status
  if (!isAuthenticated) {
    // Public home page for non-authenticated users
    return (
      <>
        <Hero />
        <Services />
        <HowItWorks />
      </>
    );
  }

  // Show authenticated user home page with dashboard access
  return (
    <main className="min-h-[calc(100vh-4rem)] pt-24 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Welcome back, {user?.name || user?.email || 'User'}!
          </h1>
          <p className="text-slate-600 mb-8">
            Ready to continue? Access your personalized dashboard below.
          </p>
        </div>

        <div className="space-y-6">
          <Link
            href={getDashboardUrl()}
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Access</h3>
              <p className="text-sm text-slate-600">Jump directly to your dashboard</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Recent Activity</h3>
              <p className="text-sm text-slate-600">View your latest updates</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Settings</h3>
              <p className="text-sm text-slate-600">Manage your preferences</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
