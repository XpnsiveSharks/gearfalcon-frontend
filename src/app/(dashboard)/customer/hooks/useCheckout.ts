"use client";

import { useState } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

interface CheckoutResponse {
    redirectUrl: string;
}

export const useCheckout = () => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckoutSource = async (customerAddressId: number, scheduledDate: string): Promise<void> => {
        setIsCheckingOut(true);
        setError(null);

        try {
            const response = await http.post<CheckoutResponse>('/customers/cart/checkout', {
                customer_address_id: customerAddressId,
                scheduled_date: scheduledDate,
            });

            if (response.data.redirectUrl) {
                // Redirect the user to the PayMongo payment page
                window.location.href = response.data.redirectUrl;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Checkout failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsCheckingOut(false);
        }
        // No need to set isCheckingOut to false on success, as the page will redirect.
    };

    return { createCheckoutSource, isCheckingOut, error };
};