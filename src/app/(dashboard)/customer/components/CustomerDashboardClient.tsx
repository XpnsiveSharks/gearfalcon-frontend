"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { JwtPayload } from "@/app/_shared/lib/jwt";
import { useCustomerInfo } from '../hooks/useCustomerInfo';
import { useCart } from '../hooks/useCart';


interface CustomerDashboardClientProps {
  user: JwtPayload;
}
type Tab = 'bookings' | 'history' | 'profile';
type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
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
        <ChangePasswordView />
      </div>
    );
  };

  const ChangePasswordView: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const passwordStrength = useMemo(() => {
      if (!newPassword) return null;
      let score = 0;
      if (newPassword.length >= 8) score++;
      if (newPassword.length >= 12) score++;
      if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score++;
      if (/\d/.test(newPassword)) score++;
      if (/[^a-zA-Z0-9]/.test(newPassword)) score++;

      if (score <= 1) return 'very-weak';
      if (score === 2) return 'weak';
      if (score === 3) return 'medium';
      if (score === 4) return 'strong';
      return 'very-strong';
    }, [newPassword]);

    const getStrengthColor = (strength: PasswordStrength | null) => {
      switch (strength) {
        case 'very-strong': return 'bg-green-500';
        case 'strong': return 'bg-blue-500';
        case 'medium': return 'bg-yellow-500';
        case 'weak': return 'bg-orange-500';
        case 'very-weak': return 'bg-red-500';
        default: return 'bg-gray-200';
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
      if ((passwordStrength === 'weak' || passwordStrength === 'very-weak')) {
        setError("New password is too weak.");
        return;
      }

      setIsSubmitting(true);
      // Here you would typically make an API call to change the password
      // For demonstration, we'll just simulate it.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success/error
      if (currentPassword === "password123") { // Simulate wrong current password
        setError("The current password you entered is incorrect.");
      } else {
        setSuccess("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      setIsSubmitting(false);
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
            {newPassword && passwordStrength && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${getStrengthColor(passwordStrength)}`} style={{ width: `${(Object.keys(['very-weak', 'weak', 'medium', 'strong', 'very-strong']).indexOf(passwordStrength) + 1) * 20}%` }}></div></div>
                <span className="text-xs text-gray-500 capitalize">{passwordStrength.replace('-', ' ')}</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 flex items-center">
            {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
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
            { id: 'Availed Jobs', label: 'Availed Jobs' },
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
          <CartView />
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

const CartView: React.FC = () => {
  const router = useRouter();
  const { cartItems, loading, error } = useCart();
  console.log('CartView Data:', { cartItems, loading, error });
  

  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Cart</h2>
        <button
          onClick={() => router.push('/booking')}
          className="px-6 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Book New Service
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="animate-spin text-gray-400" size={24} />
          <p className="ml-3 text-gray-500">Loading cart...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 bg-red-50 p-10 rounded-2xl border border-red-200">
          <p>Error loading cart: {error}</p>
        </div>
      )}

      {!loading && !error && (
        cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Service ID: {item.service_id}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.notes && <p className="text-xs text-gray-500 italic mt-1">Notes: &quot;{item.notes}&quot;</p>}
                </div>
                <button className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  Proceed
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 text-center text-gray-500 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <p>Your cart is empty.</p>
          </div>
        )
      )}
    </div>
  );
};