"use client";

import React from 'react';
import { useCustomerInfo } from '../hooks/useCustomerInfo';

const SettingsPage: React.FC = () => {
  // The API response nests customer data under a 'customer' key. We use a type assertion to inform TypeScript.
  const { customerInfo, loading, error } = useCustomerInfo() as { customerInfo: any, loading: boolean, error: string | null };

  React.useEffect(() => {
    if (customerInfo) {
      console.log('Customer Info:', customerInfo);
    }
  }, [customerInfo]);


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
    <div className="max-w-4xl mx-auto p-6 pt-24 bg-gray-50 min-h-screen">
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
  );
};

export default SettingsPage;
