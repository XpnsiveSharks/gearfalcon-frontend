"use client";

import React, { useEffect } from 'react';
import { useCustomerInfo } from '../hooks/useCustomerInfo';

// Define a type that matches the actual API response for clarity
type CustomerData = {
  customer_id: number;
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  company_name: string;
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

const CustomerSettingsPage = () => {
  // We cast the result to `any` to handle the discrepancy between the project's `User` type and the actual API response.
  const { customerInfo, loading, error } = useCustomerInfo() as { customerInfo: any, loading: boolean, error: string | null };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading customer information...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error: {error}</p></div>;
  }

  // The API response nests the customer data under a 'customer' key.
  const customer: CustomerData | null = customerInfo?.customer;

  if (!customer) {
    return <div className="flex justify-center items-center h-screen"><p>No customer information found.</p></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Customer Settings</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Role:</strong> {customer.role}</p>
          <p><strong>Verified:</strong> {customer.is_verified ? 'Yes' : 'No'}</p>
          <p><strong>Company Name:</strong> {customer.company_name}</p>
          <p><strong>Customer ID:</strong> {customer.customer_id}</p>
          <p><strong>User ID:</strong> {customer.user_id}</p>
        </div>

        {customer.address && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>House Number:</strong> {customer.address.house_number}</p>
              <p><strong>Street:</strong> {customer.address.street}</p>
              <p><strong>Barangay:</strong> {customer.address.barangay}</p>
              <p><strong>City:</strong> {customer.address.city}</p>
              <p><strong>Province:</strong> {customer.address.province}</p>
              <p><strong>Region:</strong> {customer.address.region}</p>
              <p><strong>Postal Code:</strong> {customer.address.postal_code}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
