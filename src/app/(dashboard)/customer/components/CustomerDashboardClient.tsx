"use client";

import { useState } from "react";
import { JwtPayload } from "@/app/_shared/lib/jwt";
import PasswordStrengthIndicator from "@/app/_shared/components/PasswordStrengthIndicator";

interface CustomerDashboardClientProps {
  user: JwtPayload;
}

export default function CustomerDashboardClient({ user }: CustomerDashboardClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create customer account
      console.log("Creating customer account:", { email, password });

      // Reset form after successful submission
      setEmail("");
      setPassword("");

      alert("Customer account created successfully!");
    } catch (error) {
      console.error("Error creating customer account:", error);
      alert("Failed to create customer account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user.name || user.email}!</p>
        <p className="text-sm text-slate-500">Role: {user.role} • Email: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Management Section */}
        <div className="space-y-6">
          <div className="p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Customer Account</h2>
            <p className="text-sm text-slate-600 mb-6">
              Create new customer accounts for service bookings and management.
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
                  placeholder="customer@company.com"
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  userType="customer"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creating Account..." : "Create Customer Account"}
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Service Bookings</h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white rounded-md border">
                <h3 className="font-semibold text-slate-900">Active Bookings</h3>
                <p className="text-sm text-slate-600 mt-1">View and manage your service appointments</p>
              </div>

              <div className="p-4 bg-white rounded-md border">
                <h3 className="font-semibold text-slate-900">Service History</h3>
                <p className="text-sm text-slate-600 mt-1">Review past services and maintenance</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-slate-50 transition-colors">
                Book New Service
              </button>
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-slate-50 transition-colors">
                View Service Quotes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}