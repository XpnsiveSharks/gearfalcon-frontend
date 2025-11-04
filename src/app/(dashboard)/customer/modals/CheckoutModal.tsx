"use client";

import React, { useState } from 'react';
import { Loader2, X, AlertTriangle } from 'lucide-react';
import { useCheckout } from '../hooks/useCheckout';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any;
    totalAmount: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, customer, totalAmount }) => {
    const [scheduledDate, setScheduledDate] = useState('');
    const { createCheckoutSource, isCheckingOut, error } = useCheckout();
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    if (!isOpen) {
        return null;
    }

    const getMinScheduledDateString = () => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 3); // Set minimum date to 3 days from now

        const yyyy = futureDate.getFullYear();
        const mm = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const dd = String(futureDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleCheckout = () => {
        if (!customer?.address?.address_id || !scheduledDate) {
            return;
        }

        setConfirmationOpen(true);
    };

    const serviceAddress = [
        customer?.address?.house_number,
        customer?.address?.street,
        customer?.address?.barangay,
        customer?.address?.city,
        customer?.address?.province
    ].filter(Boolean).join(', ');

    return (
        <>
            {isConfirmationOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
                        <div className="flex items-start gap-5">
                            <AlertTriangle className="text-yellow-400 mt-1" size={60} />
                            <div>
                                <h4 className="text-xl font-bold text-red-800">Are you sure you want to proceed?</h4>
                                <p className="text-lg text-gray-600 mt-2">
                                    By clicking "Proceed", you will be redirected to the payment page to complete your booking.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setConfirmationOpen(false)}
                                className="px-6 py-2.5 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => { 
                                    createCheckoutSource(customer.address.address_id, scheduledDate);
                                    setConfirmationOpen(false);
                                }} 
                                className="px-6 py-2.5 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Confirm Checkout</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₱{totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Service Address</p>
                        <div className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-800">
                            {serviceAddress || 'No address provided.'}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Select Service Schedule</p>
                        <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={getMinScheduledDateString()}
                            className="w-full p-3 border rounded-lg bg-gray-50 text-sm text-gray-800"
                            required
                        />
                    </div>
                    {error && (
                        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-end items-center p-6 border-t gap-3">
                    <button type="button" onClick={onClose} disabled={isCheckingOut} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !customer?.address?.address_id || !scheduledDate}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center"
                    >
                        {isCheckingOut && <Loader2 size={16} className="animate-spin mr-2" />}
                        {isCheckingOut ? 'Redirecting...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default CheckoutModal;