"use client";

import { useState } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

export const useUpdateCustomerEmail = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateEmail = async (userId: string, newEmail: string): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);

        const payload = { new_email: newEmail };

        try {
            await http.put(`/customers/change-email/${userId}`, payload);
            toast.success('Verification email sent to your new address!');
            setIsSubmitting(false);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update email.';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsSubmitting(false);
            return false;
        }
    };

    return {
        updateEmail,
        isSubmitting,
        error,
    };
};