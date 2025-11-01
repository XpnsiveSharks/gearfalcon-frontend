"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useUpdateCustomerContact } from '../hooks/useUpdateCustomerContact';

interface ContactEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any;
    onUpdateSuccess: () => void;
}

const ContactEditModal: React.FC<ContactEditModalProps> = ({ isOpen, onClose, customer, onUpdateSuccess }) => {
    const [newContact, setNewContact] = useState('');
    const { updateContact, isSubmitting, error } = useUpdateCustomerContact();

    useEffect(() => {
        if (customer?.contact) {
            setNewContact(customer.contact);
        }
    }, [customer, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer?.user_id) {
            return;
        }
        const success = await updateContact(customer.user_id, newContact);
        if (success) {
            onUpdateSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Change Mobile Number</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="new_contact" className="text-sm text-gray-600 block mb-1">New Mobile Number</label>
                        <input
                            type="tel"
                            id="new_contact"
                            name="new_contact"
                            value={newContact}
                            onChange={(e) => setNewContact(e.target.value)}
                            placeholder="+639171234567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                        />
                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    </div>
                    <div className="flex justify-end items-center p-6 border-t gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newContact}
                            className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactEditModal;