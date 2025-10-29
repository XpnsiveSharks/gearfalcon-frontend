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

interface ApiCustomer {
  id: number;
  user_id: string;
  company_name: string | null;
  contact: string;
  created_at: string;
  updated_at: string;
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

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCustomers();
    }
  }, [isAuthLoading, fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
  };
}