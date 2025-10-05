"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JwtPayload } from "@/app/_shared/lib/jwt";
import PasswordStrengthIndicator from "@/app/_shared/components/PasswordStrengthIndicator";

interface AdminDashboardClientProps {
  user: JwtPayload;
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

    // Redirect to home page
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create admin account
      console.log("Creating admin account:", { email, password });

      // Reset form after successful submission
      setEmail("");
      setPassword("");

      alert("Admin account created successfully!");
    } catch (error) {
      console.error("Error creating admin account:", error);
      alert("Failed to create admin account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user.name || user.email}!</p>
        <p className="text-sm text-slate-500">Role: {user.role} • Email: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management Section */}
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Admin Account</h2>
            <p className="text-sm text-slate-600 mb-6">
              Create new admin accounts for your organization. Admins have full access to all system features.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Password with Strength Indicator */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <PasswordStrengthIndicator
                  password={password}
                  onPasswordChange={setPassword}
                  required
                  userType="admin"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creating Account..." : "Create Admin Account"}
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-md border">
                <h3 className="font-semibold text-slate-900">User Management</h3>
                <p className="text-sm text-slate-600 mt-1">Manage user accounts and permissions</p>
              </div>

              <div className="p-4 bg-white rounded-md border">
                <h3 className="font-semibold text-slate-900">System Settings</h3>
                <p className="text-sm text-slate-600 mt-1">Configure system preferences</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <p className="text-sm text-slate-600">
              Activity log and system notifications will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}