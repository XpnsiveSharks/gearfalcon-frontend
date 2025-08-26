"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const stats = [
  { label: "years experience", value: "19+" },
  { label: "satisfied customers", value: "1000+" },
  { label: "emergency service", value: "24/8" },
  { label: "satisfaction", value: "100%" },
];

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src="/technician.jpg"
              alt="Technician fixing wiring"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="text-slate-900">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Reliable Electrical Services You Can Trust
            </h1>
            <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-prose">
              From quick fixes to complex installations, our certified experts deliver
              safe and high‑quality workmanship for homes and businesses.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Book service now
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-slate-900 font-medium hover:bg-slate-100 transition-colors"
              >
                Get free quote
              </Link>
            </div>

            {/* Stats */}
            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="text-center">
                  <dt className="text-sm text-slate-600">{item.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


