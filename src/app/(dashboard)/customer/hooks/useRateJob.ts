"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { CustomerService } from '../../../_shared/services/CustomerService';

export const useRateJob = () => {
    const [isRating, setIsRating] = useState(false);

    const rateJob = async (jobId: string, rating: number) => {
        setIsRating(true);
        try {
            const response = await CustomerService.rateJob(jobId, rating);
            toast.success('Job rated successfully!');
            return response;
        } catch (error: any) {
            console.error("Error rating job:", error);
            const errorMessage = error?.response?.data?.message || 'Failed to rate job. Please try again.';
            toast.error(errorMessage);
            return null;
        } finally {
            setIsRating(false);
        }
    };

    return { rateJob, isRating };
};
