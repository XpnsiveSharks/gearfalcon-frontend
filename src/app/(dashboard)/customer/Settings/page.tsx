"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, Settings } from 'lucide-react';
import { useCustomerInfo } from '../hooks/useCustomerInfo';

type CustomerData = {
  customer_id: number;
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  company_name: string;
  contact: string;
  address: {
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    postal_code: string;
  };
};

const SettingsPage: React.FC = () => {
  // The API response nests customer data under a 'customer' key. We use a type assertion to inform TypeScript.
  const { customerInfo, loading, error } = useCustomerInfo() as { customerInfo: { customer: CustomerData } | null, loading: boolean, error: string | null };

  React.useEffect(() => {
    if (customerInfo) {
      console.log('Customer Info:', customerInfo);
    }
  }, [customerInfo]);

  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('settings');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/customer' },
    { id: 'booking', label: 'Booking', icon: Calendar, href: '/booking' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/customer/Settings' },
  ];

  const customer = customerInfo?.customer;

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">Error: {error}</div>;
  }

  const formatAddress = (address: any) => {
    if (!address) return null;
    const { house_number, street, barangay, city, province, postal_code, region } = address;
    return [house_number, street, barangay, city, province, postal_code, region].filter(Boolean).join(', ');
  };

  const serviceAddress = customer?.address ? formatAddress(customer.address) : '';

  return (
    <div className="flex flex-col md:h-screen bg-gray-50 pt-16">
      {/* Top Header Bar */}
      <div className="bg-blue-500 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 gap-4">
          <div className="flex items-center">
            <p className="text-sm font-medium">Welcome Back, {customer?.name || customer?.email}</p>
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
      <div className="flex-1 overflow-auto p-6">
      {/* Account Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-blue-500">Account Details</h2>
          <button className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            EDIT
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Email Address */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">Email Address</label>
            <p className="text-sm text-gray-800 font-medium mb-2">{customer?.email || 'N/A'}</p>
            {customer?.is_verified && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Verified
              </span>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">Mobile Number</label>
            <p className="text-sm text-gray-800 font-medium mb-2">{customer?.contact || 'N/A'}</p>
            {customer?.contact ? (
                 <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Verified
                 </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                Add your number
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Address Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-blue-500">Address Details</h2>
          <button className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            EDIT
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-500 block mb-3">Service Address</label>
          {serviceAddress ? (
            <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-800">{serviceAddress}</p>
            </div>
          ) : (
            <button className="px-4 py-3 border-2 border-dashed border-blue-300 text-blue-500 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
              <span className="text-lg">+</span>
              ADD YOUR ADDRESS
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;
