"use client";

import { useState, useEffect, useCallback } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { AlertCircle, Calendar, Clock, Star } from 'lucide-react';

// This is the structure from the API response for a single job
export interface ApiJob {
    id: number;
    status: string;
    scheduled_date: string;
    notes: null | string;
    is_priority: number;
    customer: {
        contact: string | null;
        user: {
            name: string;
            phone: string | null;
        };
    };
    customer_address: {
        house_number: string;
        street: string;
        barangay: string;
        city: string;
        province: string;
        postal_code: string;
    };
    service: {
        id: number;
        name: string;
        base_price: string;
    };
}

// This is the structure the component uses
export interface Job {
  id: string;
  customerName: string;
  service: string;
  jobId: string;
  date: string;
  time: string;
  location: string;
  fullAddress: string;
  phone:string;
  previousServices: number;
  serviceFee: number;
  status: 'scheduled' | 'emergency' | 'completed';
  notes: string;
  isEmergency?: boolean;
}

const transformApiJobToJob = (apiJob: ApiJob): Job => {
    const { customer_address: address, customer } = apiJob;
    const fullAddress = [
        address.house_number,
        address.street,
        address.barangay,
        address.city,
        address.province,
        address.postal_code
    ].filter(Boolean).join(', ');

    const isEmergency = apiJob.is_priority === 1;

    return {
        id: String(apiJob.id),
        customerName: customer.user.name,
        service: apiJob.service.name,
        jobId: `Job ID: GF-${new Date().getFullYear()}-${String(apiJob.id).padStart(3, '0')}`,
        date: new Date(apiJob.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: 'Time not specified', // API does not provide time
        location: address.city,
        fullAddress: fullAddress,
        phone: customer.contact || customer.user.phone || 'N/A',
        previousServices: 0, // API does not provide this
        serviceFee: parseFloat(apiJob.service.base_price),
        status: isEmergency ? 'emergency' : 'scheduled',
        notes: apiJob.notes || 'No notes provided.',
        isEmergency: isEmergency,
    };
};

export const useTechnicianJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await http.get<{ jobs: ApiJob[] }>('/technicians/jobs/assigned');
            const transformedJobs = response.data.jobs.map(transformApiJobToJob);
            setJobs(transformedJobs);
        } catch (err) {
            console.error("Failed to fetch technician jobs:", err);
            setError('Failed to load assigned jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return { jobs, loading, error, refetch: fetchJobs };
};