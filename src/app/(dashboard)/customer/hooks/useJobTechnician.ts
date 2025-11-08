import { useState, useEffect, useCallback } from 'react';
import { http } from '@/app/_shared/services/axiosClient';

interface Technician {
    id: number;
    user_id: string;
    name: string;
    email: string;
    contact: string | null;
}

export const useJobTechnician = (jobId: number | null) => {
    const [technician, setTechnician] = useState<Technician | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTechnician = useCallback(async () => {
        if (!jobId) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await http.get(`/customers/jobs/${jobId}/technician`);
            setTechnician(response.data.technician || null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred while fetching technician details.');
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        if (jobId) {
            fetchTechnician();
        }
    }, [jobId, fetchTechnician]);

    return { technician, loading, error };
};