"use client";

import { useState } from "react";
import PasswordStrengthIndicator from "@/app/shared/components/PasswordStrenghtIndicator";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    // 🚀 Here you should check if password passes validation
    // You can extend PasswordStrengthIndicator to expose `isValid` if needed.
    // For now, just block empty passwords:
    // TODO: wire submission to API; avoid logging sensitive data.
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Admin Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Password with Strength Indicator */}
        <PasswordStrengthIndicator
          password={password}
          onPasswordChange={setPassword}
          required
          userType="admin"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Admin Account
        </button>
      </form>
    </div>
  );
}
