"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Services() {
  const SectionTitle = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
        {title}
      </h2>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );

  const Card = ({
    icon,
    title,
    description,
    items,
    cta,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    items: string[];
    cta: string;
  }) => {
    const router = useRouter();

    const handleBookNow = () => {
      router.push(`/booking?service=${encodeURIComponent(title)}`);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4">{description}</p>
        <ul className="space-y-2 mb-5">
          {items.map((label, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <svg
                className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleBookNow}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2.5 rounded-lg transition-colors"
        >
          {cta}
        </button>
      </div>
    );
  };

  return (
    <section id="services" className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          title="Our Services"
          subtitle="Complete HVAC, electrical, and fire safety solutions for residential and commercial properties"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Card
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>}
            title="SALES"
            description="Premium aircon brands for your home and business"
            items={[
              "Daikin Air Conditioning Systems",
              "Carrier Air Conditioning Systems",
              "LG Air Conditioning Systems",
              "Midea Air Conditioning Systems",
            ]}
            cta="Book Now"
          />

          <Card
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>}
            title="INSTALLATION"
            description="Expert installation for residential and commercial properties"
            items={[
              "Residential Air Conditioning Installation",
              "Commercial Air Conditioning Installation",
              "VRF (Variable Refrigerant Flow) System",
              "All types of aircon system",
            ]}
            cta="Book Now"
          />

          <Card
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v10H7z"/></svg>}
            title="REPAIRS"
            description="Complete repair and maintenance services"
            items={[
              "General Cleaning",
              "Preventative Maintenance Programs",
              "System Diagnostics",
              "Spare Parts Replacement",
            ]}
            cta="Book Now"
          />

          <Card
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3zm0 0c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3z"/></svg>}
            title="OTHERS"
            description="Specialized HVAC, ducting, and fire safety systems"
            items={[
              "HVAC Components Service",
              "Ducting Installation & Repair",
              "Chiller Services",
              "FDAS (Fire Detection and Alarm System)",
            ]}
            cta="Book Now"
          />
        </div>
      </div>
    </section>
  );
}
