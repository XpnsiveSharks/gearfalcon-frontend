"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useServices } from "@/app/_shared/hooks/useServices";
import { Loader2, Wrench, Settings, Clock } from "lucide-react";

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
      router.push(`/book?service=${encodeURIComponent(title)}`);
    };

    return (
      <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4">{description}</p>
        <ul className="space-y-2 mb-5 flex-grow">
          {items.map((label, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
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

  const { services, categories, loading, error } = useServices();

  // Group services by category ID and get the first 4 service names for display
  const servicesByCategory = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories.map(category => {
      const categoryServices = services
        .filter(service => service.category_id === category.id)
        .slice(0, 5) // Get first 4 services for the card
        .map(service => service.name);
      return {
        ...category,
        items: categoryServices,
      };
    });
  }, [services, categories]);

  // Map category names to icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toUpperCase();
    if (name.includes('INSTALLATION')) return <Wrench className="w-5 h-5" />;
    if (name.includes('REPAIRS')) return <Settings className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />; // Default icon
  };

  return (
    <section id="services" className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          title="Our Services"
          subtitle="Complete HVAC, electrical, and fire safety solutions for residential and commercial properties"
        />
        {loading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin text-slate-400" size={32} />
            <p className="ml-4 text-slate-500">Loading services...</p>
          </div>
        )}
        {error && !loading && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {servicesByCategory.map((category) => (
              <Card
                key={category.id}
                icon={getCategoryIcon(category.name)}
                title={category.name.toUpperCase()}
                description={category.description || `Explore our ${category.name} services.`}
                items={category.items}
                cta="Book Now"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
