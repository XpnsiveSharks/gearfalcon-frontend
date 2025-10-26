"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, Settings, Clock, CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { JwtPayload } from "@/app/_shared/lib/jwt";
import { useCustomerInfo } from '../hooks/useCustomerInfo';


interface CustomerDashboardClientProps {
  user: JwtPayload;
}
type Tab = 'bookings' | 'history' | 'profile';

// Define the type for customer data, similar to SettingsPage
type CustomerData = {
  customer_id: number;
  user_id: number;
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

export default function CustomerDashboardClient({ user }: CustomerDashboardClientProps) {
  const { customerInfo, loading, error } = useCustomerInfo() as { customerInfo: any, loading: boolean, error: string | null };

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [activeNav, setActiveNav] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/customer' },
    { id: 'booking', label: 'Booking', icon: Calendar, href: '/booking' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/customer/Settings' },
  ];
  
  const customer = customerInfo?.customer;
  if (loading) {
    return <div className="flex flex-col h-screen bg-gray-50 items-center justify-center text-gray-700">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex flex-col h-screen bg-gray-50 items-center justify-center text-red-600">Error: {error}</div>;
  }

  const ProfileView: React.FC<{ customer: CustomerData | null }> = ({ customer }) => {
    const formatAddress = (address: any) => {
      if (!address) return null;
      const { house_number, street, barangay, city, province, postal_code, region } = address;
      return [house_number, street, barangay, city, province, postal_code, region].filter(Boolean).join(', ');
    };
  
    const serviceAddress = customer?.address ? formatAddress(customer.address) : '';
  
    return (
      <div className="space-y-6">
        {/* Account Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
            <button 
              onClick={() => router.push('/customer/Settings')}
              className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              EDIT
            </button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
            <button 
              onClick={() => router.push('/customer/Settings')}
              className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
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
              <button 
                onClick={() => router.push('/customer/Settings')}
                className="px-4 py-3 border-2 border-dashed border-blue-300 text-blue-500 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                ADD YOUR ADDRESS
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your HVAC service bookings and view service history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3> {/* Replaced hardcoded value */}
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Services</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3> {/* Replaced hardcoded value */}
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                <h3 className="text-3xl font-bold text-gray-900">₱0</h3> {/* Replaced hardcoded value */}
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <CreditCard className="text-orange-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Service</p>
                <h3 className="text-3xl font-bold text-gray-900">N/A</h3> {/* Replaced hardcoded value */}
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Clock className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-full shadow-sm mb-6 p-2 flex gap-2">
          {[
            { id: 'bookings', label: 'My Bookings' },
            { id: 'history', label: 'Service History' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Current Bookings</h2>
              <button
                onClick={() => router.push('/booking')}
                className="px-6 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Book New Service
              </button>
            </div>
            <div className="space-y-4 text-center text-gray-500 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <p>No current bookings to display.</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service History</h2>
            <p>No completed services yet.</p>
          </div>
        )}

        {activeTab === 'profile' && <ProfileView customer={customer} />}

      </div>
    </div>
  );
}