import { useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '@/app/_shared/services/axiosClient';

export const useCancelJob = () => {
    const [isCancelling, setIsCancelling] = useState(false);

    const cancelJob = async (jobId: number) => {
        setIsCancelling(true);
        try {
            await http.put(`/customers/jobs/${jobId}/cancel`);
            toast.success('Job cancelled and refund requested successfully.');
            return true;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to cancel job.';
            toast.error(errorMessage);
            console.error('Failed to cancel job:', error);
            return false;
        } finally {
            setIsCancelling(false);
        }
    };

    return {
        cancelJob,
        isCancelling,
    };
};