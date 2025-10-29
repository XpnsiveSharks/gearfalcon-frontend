"use client";

import { useState, useEffect, useCallback } from 'react';
import { useCustomers, Customer as CustomerData } from './useCustomers';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

interface User {
  id: string;
  name: string;
  customer_id?: number; // Add customer_id to User for easier lookup
  email: string;
}

interface Customer {
  contact: string;
  user: User;
}

interface Service {
  id: number;
  name: string;
  base_price: string;
}

interface CustomerAddress {
  house_number: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
}

interface Technician {
    user: User;
}

interface ApiJob {
  id: number;
  status: string;
  scheduled_date: string | null;
  notes: string | null;
  customer_id: number;
  customer?: Customer;
  service?: Service;
  customer_address?: CustomerAddress;
}

interface ApiAssignment {
    id: number;
    job: ApiJob;
    technician: Technician;
}

export interface Job {
  id: number;
  customerName: string;
  customerContact: string;
  serviceName: string;
  address: string;
  scheduledDate: string | null;
  notes: string | null;
  status: string;
  technicianName?: string;
}

const formatAddress = (addr: CustomerAddress): string => {
    return [addr.house_number, addr.street, addr.barangay, addr.city, addr.province, addr.postal_code].filter(Boolean).join(', ');
};

const formatJob = (job: ApiJob, customers: CustomerData[]): Job => {
  const customerInfo = customers.find(c => c.customer_id === job.customer_id);

  return {
    id: job.id,
    customerName: customerInfo?.name || job.customer?.user.name || 'N/A',
    customerContact: customerInfo?.phone || job.customer?.contact || 'N/A',
    serviceName: job.service?.name || 'N/A',
    address: job.customer_address ? formatAddress(job.customer_address) : 'N/A',
    scheduledDate: job.scheduled_date,
    notes: job.notes,
    status: job.status,
  };
};

export function useJobs() {
  const [emergencyJobs, setEmergencyJobs] = useState<Job[]>([]);
  const [takenJobs, setTakenJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  
  const [loading, setLoading] = useState({ emergency: true, taken: true, available: true });
  const [error, setError] = useState<{ emergency: string | null; taken: string | null; available: string | null }>({ emergency: null, taken: null, available: null });

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { customers, loading: customersLoading } = useCustomers();

  const fetchData = useCallback(async (endpoint: string, setData: (data: any) => void, dataKey: string, type: 'emergency' | 'taken' | 'available', allCustomers: CustomerData[]) => {
    if (!isAuthenticated) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));

    try {
      const response = await http.get(`/admin/jobs/${endpoint}`);
      const data = response.data[dataKey] || (type === 'taken' ? [] : response.data);

      if (type === 'taken') {
        const formattedData = data.map((assignment: ApiAssignment) => ({
            ...formatJob(assignment.job, allCustomers),
            technicianName: assignment.technician.user.name,
        }));
        setData(formattedData);
      } else {
        const formattedData = data.map((job: ApiJob) => formatJob(job, allCustomers));
        setData(formattedData);
      }
    } catch (err: any) {
      setError(prev => ({ ...prev, [type]: axiosUtils.getErrorMessage(err) }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && !customersLoading) {
      fetchData('emergency', setEmergencyJobs, 'jobs', 'emergency', customers);
      fetchData('taken', setTakenJobs, 'assignments', 'taken', customers);
      fetchData('available', setAvailableJobs, 'jobs', 'available', customers);
    } else if (!isAuthLoading && !isAuthenticated) {
        const authError = "User is not authenticated.";
        setError({ emergency: authError, taken: authError, available: authError });
        setLoading({ emergency: false, taken: false, available: false });
    }
  }, [isAuthLoading, isAuthenticated, fetchData, customers, customersLoading]);

  return {
    emergencyJobs,
    takenJobs,
    availableJobs,
    loading,
    error,
  };
}