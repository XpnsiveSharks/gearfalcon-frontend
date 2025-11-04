"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

export interface Job {
  id: number;
  serviceName: string;
  customerName: string;
  customerContact: string;
  address: string;
  scheduledDate: string | null;
  technicianName: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'available_for_claim' | 'claimed';
}

export function useJobs() {
  const [emergencyJobs, setEmergencyJobs] = useState<Job[]>([]);
  const [takenJobs, setTakenJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState({ emergency: true, taken: true, available: true });
  const [error, setError] = useState<{ emergency: string | null; taken: string | null; available: string | null }>({ emergency: null, taken: null, available: null });
  const { isAuthenticated } = useAuth();

  const transformApiJob = (apiJob: any): Job => {
      const { customer, customer_address, service, assignments } = apiJob;
      const fullAddress = [
          customer_address?.house_number,
          customer_address?.street,
          customer_address?.barangay,
          customer_address?.city,
          customer_address?.province
      ].filter(Boolean).join(', ');

      const technician = assignments?.[0]?.technician;

      return {
          id: apiJob.id,
          serviceName: service?.name || 'N/A',
          customerName: customer?.user?.name || 'N/A',
          customerContact: customer?.contact || 'N/A',
          address: fullAddress,
          scheduledDate: apiJob.scheduled_date,
          technicianName: technician?.user?.name || null,
          notes: apiJob.notes,
          status: apiJob.status,
      };
  };

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading({ emergency: false, taken: false, available: false });
      return;
    }
    setLoading({ emergency: true, taken: true, available: true });
    setError({ emergency: null, taken: null, available: null });

    const fetchEmergency = async () => {
      try {
        const response = await http.get('/admin/jobs/emergency');
        const apiJobs = response.data.jobs || [];
        setEmergencyJobs(apiJobs.map(transformApiJob));
      } catch (err) {
        setError(prev => ({ ...prev, emergency: axiosUtils.getErrorMessage(err) }));
      } finally {
        setLoading(prev => ({ ...prev, emergency: false }));
      }
    };

    const fetchTakenJobs = async () => {
      try {
        const response = await http.get('/admin/jobs/taken');
        const assignments = response.data.assignments || [];
        const taken = assignments.map((assignment: any) => {
          const job = transformApiJob(assignment.job);
          job.technicianName = assignment.technician?.user?.name || 'N/A';
          return job;
        });
        setTakenJobs(taken);
      } catch (err) {
        setError(prev => ({ ...prev, taken: axiosUtils.getErrorMessage(err) }));
      } finally {
        setLoading(prev => ({ ...prev, taken: false }));
      }
    };

    const fetchAvailableJobs = async () => {
      try {
        const response = await http.get('/admin/jobs/available');
        const apiJobs = response.data.jobs || [];
        setAvailableJobs(apiJobs.map(transformApiJob));
      } catch (err) {
        setError(prev => ({ ...prev, available: axiosUtils.getErrorMessage(err) }));
      } finally {
        setLoading(prev => ({ ...prev, available: false }));
      }
    };

    // Run fetches in parallel
    await Promise.all([
      fetchEmergency(),
      fetchTakenJobs(),
      fetchAvailableJobs()
    ]);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [fetchJobs, isAuthenticated]);

  return {
      emergencyJobs,
      takenJobs,
      availableJobs,
      loading,
      error,
      refetchJobs: fetchJobs
  };
}