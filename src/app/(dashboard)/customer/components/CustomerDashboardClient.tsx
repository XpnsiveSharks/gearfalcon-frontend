"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, Settings } from 'lucide-react';
import { JwtPayload } from "@/app/_shared/lib/jwt";

interface CustomerDashboardClientProps {
  user: JwtPayload;
}

type Tab = 'new' | 'pending' | 'completed' | 'canceled';

export default function CustomerDashboardClient({ user }: CustomerDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [activeNav, setActiveNav] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/customer' },
    { id: 'booking', label: 'Booking', icon: Calendar, href: '/booking' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/customer/Settings' },
  ];  

  return (
    <div className="flex flex-col md:h-screen bg-gray-50 pt-16">
      {/* Top Header Bar */}
      <div className="bg-blue-500 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 gap-4">
          <div className="flex items-center">
            <p className="text-sm font-medium">Welcome Back, {user.name || user.email}</p>
          </div>

          <nav className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    router.push(item.href);
                  }}
                  className={`px-4 md:px-6 py-2 flex items-center gap-2 transition-all rounded-xl ${
                    activeNav === item.id
                      ? 'bg-white text-blue-500 shadow-md'
                      : 'hover:bg-blue-600'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white px-8 py-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Home</h1>
          
          {/* Profile Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="text-xs text-gray-500 block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={user.name || 'N/A'}
                readOnly
                className="w-full text-sm text-gray-700 bg-transparent border-none p-0 focus:outline-none font-medium"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="text-xs text-gray-500 block mb-2 font-medium">Contact Number</label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-500 font-medium">
                Add your Contact Number
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="text-xs text-gray-500 block mb-2 font-medium">Email Address</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="w-full text-sm text-gray-700 bg-transparent border-none p-0 focus:outline-none font-medium"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <label className="text-xs text-gray-500 block mb-2 font-medium">Home Address</label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-500 font-medium">
                Add your Home Address
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white mt-6 mx-8 rounded-2xl shadow-sm px-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'new', label: 'New Requests' },
              { id: 'pending', label: 'Pending Requests' },
              { id: 'completed', label: 'Completed Requests' },
              { id: 'canceled', label: 'Canceled Requests' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-3 px-4 text-sm font-medium transition-all -mb-px ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Requests Panel */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-blue-500 mb-4">New Requests</h2>
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="mb-4 font-medium">No data available yet</p>
              <div className="flex items-center gap-2 mb-4">
                <button className="px-4 py-2 text-sm bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors">First</button>
                <button className="px-4 py-2 text-sm bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors">&lt;&lt;</button>
                <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-xl font-medium shadow-md">1 / 0</button>
                <button className="px-4 py-2 text-sm bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors">&gt;&gt;</button>
                <button className="px-4 py-2 text-sm bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors">Last</button>
              </div>
              <p className="text-sm text-gray-400">Showing 0 to 0 of 0 entries</p>
            </div>
          </div>

          {/* Service Details Panel */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-blue-500 mb-4">Service Details</h2>
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
              <p className="text-gray-500 font-medium">Select a Service Request ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}