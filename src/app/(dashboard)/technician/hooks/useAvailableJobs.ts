"use client";

import { useState, useEffect, useCallback } from 'react';
import { http } from '@/app/_shared/services/axiosClient';

export interface ApiAvailableJob {
    id: number;
    scheduled_date: string | null;
    notes: null | string;
    is_priority: number;
    customer_address: {
        city: string;
        province: string;
    };
    service: {
        name: string;
        base_price: string;
    };
}

export interface AvailableJob {
  id: string;
  serviceName: string;
  location: string;
  date: string;
  notes: string;
  isPriority: boolean;
  serviceFee: number;
}

const transformApiJobToAvailableJob = (apiJob: ApiAvailabledJob): AvailableJob => {
    const isPriority = apiJob.is_priority === 1;

    return {
        id: String(apiJob.id),
        serviceName: apiJob.service.name,
        location: `${apiJob.customer_address.city}, ${apiJob.customer_address.province}`,
        date: apiJob.scheduled_date 
            ? new Date(apiJob.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
            : 'Unscheduled',
        notes: apiJob.notes || 'No additional notes.',
        isPriority: isPriority,
        serviceFee: parseFloat(apiJob.service.base_price),
    };
};

export const useAvailableJobs = () => {
    const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailableJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await http.get<{ jobs: ApiAvailableJob[] }>('/admin/jobs/available');
            const transformedJobs = response.data.jobs.map(transformApiJobToAvailableJob);
            setAvailableJobs(transformedJobs);
        } catch (err) {
            console.error("Failed to fetch available jobs:", err);
            setError('Failed to load available jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    const claimJob = useCallback(async (jobId: string) => {
        try {
            await http.post(`/technicians/jobs/${jobId}/claim`);
            // Refetch jobs to remove the claimed one from the list
            fetchAvailableJobs();
            return true;
        } catch (err) {
            console.error(`Failed to claim job ${jobId}:`, err);
            return false;
        }
    }, [fetchAvailableJobs]);

    useEffect(() => {
        fetchAvailableJobs();
    }, [fetchAvailableJobs]);

    return { availableJobs, loading, error, refetch: fetchAvailableJobs, claimJob };
};

// Renaming interface to avoid conflict if it's defined elsewhere
interface ApiAvailabledJob extends ApiAvailableJob {}