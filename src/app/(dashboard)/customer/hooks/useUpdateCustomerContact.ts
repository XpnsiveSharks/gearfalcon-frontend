"use client";

import { useState } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

export const useUpdateCustomerContact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateContact = async (userId: string, newContact: string): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);

        const payload = { contact: newContact };

        try {
            // Assuming an endpoint like this exists. Please verify with your backend API.
            await http.put(`/customers/change-contact/${userId}`, payload);
            toast.success('Contact number updated successfully!');
            setIsSubmitting(false);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update contact number.';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsSubmitting(false);
            return false;
        }
    };

    return {
        updateContact,
        isSubmitting,
        error,
    };
};