"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

export interface CompletedJob {
  id: string;
  customerName: string;
  service: string;
  jobId: string;
  completedDate: string;
  serviceFee: number;
}

const transformApiJob = (apiJob: any): CompletedJob => {
  const { customer, service } = apiJob;

  return {
    id: String(apiJob.id),
    customerName: customer?.user?.name || 'N/A',
    service: service?.name || 'N/A',
    jobId: `JOB-${apiJob.id}`,
    completedDate: apiJob.completed_date ? new Date(apiJob.completed_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'N/A',
    serviceFee: parseFloat(service?.base_price || '0'),
  };
};

export function useTechnicianServiceHistory() {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get('/technicians/jobs/service-history');
      const apiJobs = response.data.jobs || [];
      const formattedJobs = apiJobs.map(transformApiJob);
      setCompletedJobs(formattedJobs);
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
      console.error("Failed to fetch technician service history:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [fetchHistory, isAuthenticated]);

  return { completedJobs, loading, error, refetchHistory: fetchHistory };
}