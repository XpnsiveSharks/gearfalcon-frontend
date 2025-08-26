"use client";

import { useState } from "react";
import { useRegisterAdminUser } from "../hooks/useRegisterAdminUser";
import { User } from "@/app/shared/types/User";
import { isValidEmail } from "@/app/shared/lib/validators/email";

export default function AdminUserForm() {
  const { register, loading, error } = useRegisterAdminUser();

  const [user, setUser] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    house_number: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    postal_code: "",
    role: "Admin",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleChange(field: keyof User, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
    // Mark field as touched when user starts typing
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  }

  function handleBlur(field: keyof User) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function getFieldError(field: keyof User): string | null {
    if (!touched[field]) return null;
    
    const value = user[field];
    if (field === "first_name" && !value) return "First name is required";
    if (field === "last_name" && !value) return "Last name is required";
    if (field === "email") {
      if (!value) return "Email is required";
      if (typeof value === "string" && !isValidEmail(value)) return "Please enter a valid email address";
    }
    if (field === "password" && !value) return "Password is required";
    
    return null;
  }

  function hasErrors(): boolean {
    return !user.first_name || !user.last_name || !user.email || !user.password || !isValidEmail(user.email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Mark all fields as touched
    const allFields = ["first_name", "last_name", "email", "password"] as const;
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (hasErrors()) {
      setFormError("Please fill in all required fields correctly");
      return;
    }

    try {
      await register(user);
      alert("Admin user registered successfully!");
      // Reset form
      setUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        house_number: "",
        street: "",
        barangay: "",
        city: "",
        province: "",
        region: "",
        postal_code: "",
        role: "Admin",
      });
      setTouched({});
    } catch {
      // error handled by hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Messages */}
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{formError}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Personal Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter first name"
              value={user.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              onBlur={() => handleBlur("first_name")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                getFieldError("first_name") ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              aria-describedby={getFieldError("first_name") ? "first_name-error" : undefined}
            />
            {getFieldError("first_name") && (
              <p id="first_name-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getFieldError("first_name")}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter last name"
              value={user.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              onBlur={() => handleBlur("last_name")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                getFieldError("last_name") ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              aria-describedby={getFieldError("last_name") ? "last_name-error" : undefined}
            />
            {getFieldError("last_name") && (
              <p id="last_name-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getFieldError("last_name")}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Account Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                getFieldError("email") ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              aria-describedby={getFieldError("email") ? "email-error" : undefined}
            />
            {getFieldError("email") && (
              <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getFieldError("email")}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={user.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                getFieldError("password") ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              aria-describedby={getFieldError("password") ? "password-error" : undefined}
            />
            {getFieldError("password") && (
              <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getFieldError("password")}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Address Information (Optional)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="House Number"
            value={user.house_number}
            onChange={(e) => handleChange("house_number", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Street"
            value={user.street}
            onChange={(e) => handleChange("street", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Barangay"
            value={user.barangay}
            onChange={(e) => handleChange("barangay", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="City"
            value={user.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Province"
            value={user.province}
            onChange={(e) => handleChange("province", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Region"
            value={user.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Postal Code"
              value={user.postal_code}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            setUser({
              first_name: "",
              last_name: "",
              email: "",
              password: "",
              house_number: "",
              street: "",
              barangay: "",
              city: "",
              province: "",
              region: "",
              postal_code: "",
              role: "Admin",
            });
            setTouched({});
            setFormError(null);
          }}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={loading || hasErrors()}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading || hasErrors()
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Account...</span>
            </div>
          ) : (
            "Create Admin Account"
          )}
        </button>
      </div>
    </form>
  );
}
