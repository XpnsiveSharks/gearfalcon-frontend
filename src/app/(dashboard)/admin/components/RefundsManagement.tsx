"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import { Loader2, RefreshCw, ServerCrash } from 'lucide-react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface CancelledJob {
    id: number;
    customer: {
        user: {
            name: string;
        };
    };
    customer_address: {
        house_number: string;
        street: string;
        barangay: string;
        city: string;
        province: string;
        postal_code: string;
        region: string;
    };
    service: {
        name: string;
        base_price: string;
    }
}

const useCancelledJobs = () => {
    const [jobs, setJobs] = useState<CancelledJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCancelledJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await http.get('/admin/jobs/cancelled');
            setJobs(response.data.jobs || []);
        } catch (err) {
            setError(axiosUtils.getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCancelledJobs();
    }, [fetchCancelledJobs]);

    return { jobs, loading, error, refresh: fetchCancelledJobs };
};

const formatAddress = (address: CancelledJob['customer_address']) => {
    if (!address) return 'No address provided.';
    return [address.house_number, address.street, address.barangay, address.city, address.province, address.postal_code, address.region].filter(Boolean).join(', ');
};

export default function RefundsManagement() {
    const { jobs, loading, error, refresh } = useCancelledJobs();
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refundImage, setRefundImage] = useState<File | null>(null);
    const [isRefunding, setIsRefunding] = useState(false);

    const handleRefund = (jobId: number) => {
        toast.info(`Refund process for job #${jobId} would be initiated here.`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 bg-red-50 p-10 rounded-2xl border border-red-200">
                <ServerCrash className="mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold">Could not load refunds</h3>
                <p>{error}</p>
                <button onClick={refresh} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 mx-auto">
                    <RefreshCw size={16} /> Try Again
                </button>
            </div>
        );
    }

    const openModal = (jobId: number) => {
        setSelectedJobId(jobId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJobId(null);
        setRefundImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setRefundImage(e.target.files[0]);
        } else {
            setRefundImage(null);
        }
    };

    const submitRefund = async () => {
        if (!selectedJobId || !refundImage) {
            toast.error("Please select a job and an image.");
            return;
        }

        setIsRefunding(true);
        try {
            const formData = new FormData();
            formData.append('job_id', String(selectedJobId));
            formData.append('image', refundImage);

            console.log("Submitting refund request with the following data:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            await http.post('/admin/jobs/refund', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(`Refund request submitted for job #${selectedJobId}`);
            closeModal();
            refresh();
        } catch (error: any) {
            toast.error(axiosUtils.getErrorMessage(error));
        } finally {
            setIsRefunding(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Refund Requests</h1>
            <div className="space-y-4">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                            <p className="font-semibold text-gray-800">{job.customer.user.name}</p>
                            <p className="text-sm text-gray-600">{job.service.name} - ₱{parseFloat(job.service.base_price).toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatAddress(job.customer_address)}</p>
                        </div>
                        <button
                            onClick={() => openModal(job.id)}
                            className="mt-3 md:mt-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Refund
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-8">No cancelled jobs requiring a refund.</p>
                )}
            </div>

            {/* Refund Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Submit Refund Proof</h2>
                            <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="refundImage" className="block text-sm font-medium text-gray-700">
                                Upload Refund Image:
                            </label>
                            <input
                                type="file"
                                id="refundImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />
                        </div>
                        <button
                            onClick={submitRefund}
                            className="mt-3 md:mt-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Refund
                        </button>
                    </div>
                </div>)}
        </div>
    );
} 