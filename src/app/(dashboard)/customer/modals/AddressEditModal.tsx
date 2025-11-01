"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useUpdateCustomerAddress } from '../hooks/useUpdateCustomerAddress';

interface AddressEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any; // Using 'any' for simplicity, should be typed
    onUpdateSuccess: () => void;
}

const AddressEditModal: React.FC<AddressEditModalProps> = ({ isOpen, onClose, customer, onUpdateSuccess }) => {
    const [address, setAddress] = useState({
        house_number: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postal_code: '',
        region: '',
    });

    const { updateAddress, isSubmitting, error } = useUpdateCustomerAddress();

    useEffect(() => {
        if (customer?.address) {
            setAddress({
                house_number: customer.address.house_number || '',
                street: customer.address.street || '',
                barangay: customer.address.barangay || '',
                city: customer.address.city || '',
                province: customer.address.province || '',
                postal_code: customer.address.postal_code || '',
                region: customer.address.region || '',
            });
        }
    }, [customer, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customer?.user_id || !customer?.address?.address_id) {
            console.error("User ID or Address ID is missing.");
            return;
        }
        const success = await updateAddress(customer.user_id, customer.address.address_id, address);
        if (success) {
            onUpdateSuccess();
            onClose();
        }
    };

    const addressFields = [
        { name: 'house_number', label: 'House/Unit/Building No.', placeholder: 'e.g., 123' },
        { name: 'street', label: 'Street', placeholder: 'e.g., Rizal Street' },
        { name: 'barangay', label: 'Barangay', placeholder: 'e.g., San Roque' },
        { name: 'city', label: 'City/Municipality', placeholder: 'e.g., Cebu City' },
        { name: 'province', label: 'Province', placeholder: 'e.g., Cebu' },
        { name: 'postal_code', label: 'Postal Code', placeholder: 'e.g., 6000' },
        { name: 'region', label: 'Region', placeholder: 'e.g., Region VII' },
    ];

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Address</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {addressFields.map(field => (
                            <div key={field.name}>
                                <label htmlFor={field.name} className="text-sm text-gray-600 block mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={address[field.name as keyof typeof address]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
                </form>
                <div className="flex justify-end items-center p-6 border-t gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressEditModal;