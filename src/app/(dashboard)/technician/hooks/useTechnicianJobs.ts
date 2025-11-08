"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

export interface Job {
  id: string;
  customerName: string;
  service: string;
  jobId: string;
  date: string;
  time: string;
  location: string;
  fullAddress: string;
  phone: string;
  previousServices: number;
  serviceFee: number;
  status: 'scheduled' | 'emergency' | 'completed';
  notes: string;
  isEmergency?: boolean;
}

const transformApiJob = (apiJob: any): Job => {
  const { customer, customer_address, service } = apiJob;

  const fullAddress = [
    customer_address?.house_number,
    customer_address?.street,
    customer_address?.barangay,
    customer_address?.city,
    customer_address?.province,
  ].filter(Boolean).join(', ');

  // The API status needs to be mapped to the frontend status
  let jobStatus: Job['status'] = 'scheduled';
  if (apiJob.is_priority === 1) {
    jobStatus = 'emergency';
  } else if (apiJob.status === 'completed') {
    jobStatus = 'completed';
  }

  return {
    id: String(apiJob.id),
    customerName: customer?.user?.name || 'N/A',
    service: service?.name || 'N/A',
    jobId: `JOB-${apiJob.id}`,
    date: apiJob.scheduled_date ? new Date(apiJob.scheduled_date).toLocaleDateString('en-CA') : 'N/A', // YYYY-MM-DD
    time: 'Not Specified', // API does not provide a specific time
    location: customer_address?.city || 'N/A',
    fullAddress: fullAddress,
    phone: customer?.contact || 'N/A',
    previousServices: 0, // This data is not available in the provided API response
    serviceFee: parseFloat(service?.base_price || '0'),
    status: jobStatus,
    notes: apiJob.notes || 'No notes provided.',
    isEmergency: apiJob.is_priority === 1,
  };
};

export function useTechnicianJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get('/technicians/jobs/assigned');
      const apiJobs = response.data.jobs || [];
      const formattedJobs = apiJobs.map(transformApiJob);
      setJobs(formattedJobs);
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
      console.error("Failed to fetch technician jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetchJobs: fetchJobs };
}