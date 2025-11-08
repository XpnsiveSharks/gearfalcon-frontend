import { useState, useEffect, useCallback } from 'react';
import { http } from '@/app/_shared/services/axiosClient';

export const useCustomerJobs = (customerId: number | undefined) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await http.get(`/customers/jobs/${customerId}`);
      setJobs(response.data.jobs || response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refreshJobs: fetchJobs };
};
