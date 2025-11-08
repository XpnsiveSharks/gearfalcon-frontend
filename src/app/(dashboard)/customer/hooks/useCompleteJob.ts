import { useState, useCallback } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

export const useCompleteJob = () => {
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const completeJob = useCallback(async (jobId: number): Promise<boolean> => {
        setIsCompleting(true);
        setError(null);
        try {
            await http.put(`/customers/jobs/${jobId}/complete`);
            toast.success('Job marked as complete!');
            setIsCompleting(false);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to complete the job.';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsCompleting(false);
            return false;
        }
    }, []);

    return { completeJob, isCompleting, error };
};