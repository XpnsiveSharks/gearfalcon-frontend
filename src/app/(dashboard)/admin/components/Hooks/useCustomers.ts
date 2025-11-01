"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

interface User {
  id: string;
  name: string;
  email: string;
  deleted_at?: string | null;
}

interface Address {
  id: number;
  customer_id: number;
  house_number: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
  is_primary: 1 | 0;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiCustomer {
  id: number;
  user_id: string;
  company_name: string | null;
  contact: string;
  addresses: Address[];
  deleted_at: string | null;
  user: User;
}

export interface Customer {
  customer_id: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: number;
  lastService: string;
  rating: number;
  status: 'active' | 'inactive';
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for single customer details
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const API_URL = '/admin/customers';

  const fetchCustomers = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(API_URL);
      const apiCustomers: ApiCustomer[] = response.data.customers || [];
      const formattedCustomers: Customer[] = apiCustomers.map(c => ({
        customer_id: c.id,
        id: c.user.id || c.user_id,
        name: c.user.name,
        email: c.user.email,
        phone: c.contact,
        location: 'N/A', // Not in API response
        totalBookings: 0, // Not in API response
        totalSpent: 0, // Not in API response
        lastService: 'N/A', // Not in API response
        rating: 0, // Not in API response
        status: c.user.deleted_at ? 'inactive' : 'active',
      }));
      setCustomers(formattedCustomers);
    } catch (err: any) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCustomerById = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      setDetailsError("User is not authenticated.");
      return;
    }
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const response = await http.get(`/admin/customers/${id}`);
      const apiCustomer: ApiCustomer = response.data.customer;
      const formattedCustomer: Customer = {
        customer_id: apiCustomer.id,
        id: apiCustomer.user.id || apiCustomer.user_id,
        name: apiCustomer.user.name,
        email: apiCustomer.user.email,
        phone: apiCustomer.contact,
        location: (() => {
          if (!apiCustomer.addresses || apiCustomer.addresses.length === 0) {
            return 'N/A';
          }
          // Find the primary address, or fall back to the first one
          const primaryAddress = apiCustomer.addresses.find(addr => addr.is_primary === 1) || apiCustomer.addresses[0];
          if (!primaryAddress) return 'N/A';

          // Format the address into a single string
          return [
            primaryAddress.house_number,
            primaryAddress.street,
            primaryAddress.barangay,
            primaryAddress.city,
            primaryAddress.province,
          ].filter(Boolean).join(', ');
        })(),
        status: apiCustomer.user.deleted_at ? 'inactive' : 'active',
        totalBookings: 0, totalSpent: 0, lastService: 'N/A', rating: 0,
      };
      setCustomerDetails(formattedCustomer);
    } catch (err) {
      setDetailsError(axiosUtils.getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCustomers();
    }
  }, [isAuthLoading, fetchCustomers]);

  return {
    customers,
    loading,
    error,
    customerDetails,
    detailsLoading,
    detailsError,
    fetchCustomers,
    fetchCustomerById,
  };
}