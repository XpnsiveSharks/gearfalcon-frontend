"use client";

import { useState } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

interface AddressData {
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postal_code: string;
    region: string;
}

export const useUpdateCustomerAddress = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateAddress = async (userId: string, addressId: number, addressData: AddressData): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);

        // Explicitly construct the payload to ensure correct structure
        // and prevent any accidental properties from addressData overwriting the id.
        const payload = {
            address_id: addressId,
            house_number: addressData.house_number,
            street: addressData.street,
            barangay: addressData.barangay,
            city: addressData.city,
            province: addressData.province,
            postal_code: addressData.postal_code,
            region: addressData.region,
        };

        try {
            await http.put(`/customers/change-address/${userId}`, payload);
            toast.success('Address updated successfully!');
            setIsSubmitting(false);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update address.';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsSubmitting(false);
            return false;
        }
    };

    return {
        updateAddress,
        isSubmitting,
        error,
    };
};