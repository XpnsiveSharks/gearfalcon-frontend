"use client";

import React, { useState } from "react";
import Link from "next/link";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-100 text-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold">
              GearFalcon
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/pricing" className="hover:opacity-80 transition-opacity">
              Pricing
            </Link>
            <Link href="/services" className="hover:opacity-80 transition-opacity">
              Our Services
            </Link>
            <Link href="/about" className="hover:opacity-80 transition-opacity">
              About
            </Link>
            <Link href="/contact" className="hover:opacity-80 transition-opacity">
              Contact
            </Link>
            <Link href="/login" className="hover:opacity-80 transition-opacity">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="space-y-1 px-4 py-3">
            <Link href="/pricing" className="block py-2 hover:opacity-80">
              Pricing
            </Link>
            <Link href="/services" className="block py-2 hover:opacity-80">
              Our Services
            </Link>
            <Link href="/about" className="block py-2 hover:opacity-80">
              About
            </Link>
            <Link href="/contact" className="block py-2 hover:opacity-80">
              Contact
            </Link>
            <Link href="/login" className="block py-2 hover:opacity-80">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;