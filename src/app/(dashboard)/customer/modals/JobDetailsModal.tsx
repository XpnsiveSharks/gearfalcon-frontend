"use client";

import React from 'react';
import { Loader2, X, User, Phone, Wrench, Tag, FileText, CheckCircle } from 'lucide-react';
import { useJobTechnician } from '../hooks/useJobTechnician';
import { useCompleteJob } from '../hooks/useCompleteJob';

interface JobDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: any;
    onJobCompleted: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div>
        <label className="text-xs text-gray-500 flex items-center gap-2 mb-1">
            {icon}
            {label}
        </label>
        <p className="text-sm text-gray-800 pl-6">{value || 'N/A'}</p>
    </div>
);

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, job, onJobCompleted }) => {
    const { technician, loading: techLoading, error: techError } = useJobTechnician(isOpen ? job?.id : null);
    const { completeJob, isCompleting } = useCompleteJob();

    if (!isOpen) {
        return null;
    }

    const handleCompleteJob = async () => {
        if (!job?.id) return;
        const success = await completeJob(job.id);
        if (success) {
            onJobCompleted();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Technician Details */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-3">Technician Information</h3>
                        {techLoading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 size={16} className="animate-spin" />
                                <span>Loading technician details...</span>
                            </div>
                        ) : techError ? (
                            <p className="text-sm text-red-500">{techError}</p>
                        ) : technician ? (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <User size={16} className="text-gray-500" />
                                    <p className="text-sm font-medium text-gray-900">{technician.name}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-500" />
                                    <p className="text-sm text-gray-900">{technician.contact || 'No contact number'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No technician assigned to this job.</p>
                        )}
                    </div>

                    {/* Service Details */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-4">Service Details</h3>
                        <div className="space-y-4">
                            <DetailItem icon={<Wrench size={14} />} label="Service Name" value={job?.service?.name} />
                            <DetailItem icon={<Tag size={14} />} label="Base Price" value={`₱${parseFloat(job?.service?.base_price || '0').toFixed(2)}`} />
                            <DetailItem icon={<FileText size={14} />} label="Description" value={job?.service?.description || 'No description available.'} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center p-6 border-t gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                        Close
                    </button>
                    {job?.status?.toLowerCase() === 'claimed' && (
                        <button
                            type="button"
                            onClick={handleCompleteJob}
                            disabled={isCompleting}
                            className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center gap-2"
                        >
                            {isCompleting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            {isCompleting ? 'Completing...' : 'Complete Job'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;