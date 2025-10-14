"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import { useAuth } from "@/app/_shared/hooks/useAuth"; // ✅ use your existing auth hook

export default function BookPage() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");

  const { user, isAuthenticated } = useAuth(); // ✅ get auth state

  // Define all sub-services per category
  const servicesMap: Record<string, string[]> = {
    SALES: [
      "Daikin Air Conditioning Systems",
      "Carrier Air Conditioning Systems",
      "LG Air Conditioning Systems",
      "Midea Air Conditioning Systems",
      "Samsung Air Conditioning Systems",
    ],
    INSTALLATION: [
      "Residential Air Conditioning Installation",
      "Commercial Air Conditioning Installation",
      "VRF (Variable Refrigerant Flow) Systems",
      "Chilled Water Systems",
      "Split Type Units",
      "Ducted Systems",
    ],
    REPAIRS: [
      "Preventative Maintenance Programs",
      "General Cleaning Services",
      "System Diagnostics",
      "Spare Parts Replacement",
      "Freon Recharging & Leak Testing",
      "Aircon Dismantle & Relocation",
      "Aircon Re-wiring",
      "System Re-processing",
      "Pull Down Unit Services",
      "Compressor Motor Repair/Replacement",
    ],
    OTHERS: [
      "Evaporator Coil Services",
      "Condenser Coil Services",
      "Chilled Water Coil Services",
      "Shell and Tube Services",
      "Complete HVAC Unit Services",
      "Ducting Installation & Repair",
      "Chiller Services",
      "FDAS (Fire Detection and Alarm System)",
      "AFSS (Automatic Fire Suppression System)",
      "Preventive Maintenance for Fire Systems",
    ],
  };

  // Get list of sub-services based on selected main service
  const subServices = useMemo(() => {
    if (!service) return [];
    return servicesMap[service.toUpperCase()] || [];
  }, [service]);

  const [selectedSubService, setSelectedSubService] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      mainService: service,
      subService: selectedSubService,
      details,
      user: isAuthenticated
        ? { name: user?.name, email: user?.email }
        : "Guest",
    };

    console.log("Booking Data:", bookingData);
    alert("Booking submitted!");
  };

  return (
    <div className="max-w-xl mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Book a Service</h1>

      <p className="text-slate-700 mb-6">
        You’re booking:{" "}
        <strong>{service || "Select a main service first"}</strong>
      </p>

      {!service ? (
        <p className="text-slate-500">
          Please go back and choose a service category first.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ If logged in, show user info */}
          {isAuthenticated && user ? (
            <div className="bg-slate-50 border rounded-lg p-4 space-y-1">
              <p className="text-slate-700 text-sm">
                Booking as: <strong>{user.name}</strong>
              </p>
              <p className="text-slate-700 text-sm">{user.email}</p>
            </div>
          ) : (
            <>
              {/* ✅ If not logged in, require name/email */}
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </>
          )}

          {/* Dropdown for sub-services */}
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedSubService}
            onChange={(e) => setSelectedSubService(e.target.value)}
            required
          >
            <option value="">Select a sub-service</option>
            {subServices.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Additional details */}
          <textarea
            placeholder="Additional Details"
            className="w-full border rounded-lg px-3 py-2"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2.5 rounded-lg transition-colors"
          >
            Submit Booking
          </button>
        </form>
      )}
    </div>
  );
}
