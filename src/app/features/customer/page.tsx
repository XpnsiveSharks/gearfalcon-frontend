"use client";

import { useState, type FormEvent } from "react";

import PasswordStrengthIndicator from "@/app/shared/components/PasswordStrenghtIndicator";


export default function CustomerRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    console.log("Customer account created:", { email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Customer Account</h1>
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
          userType="customer"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Customer Account
        </button>
      </form>
    </div>
  );
}
