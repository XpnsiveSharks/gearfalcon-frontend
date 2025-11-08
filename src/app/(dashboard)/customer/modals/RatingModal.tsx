"use client";

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import { useRateJob } from '../hooks/useRateJob';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    onRatingSubmitted: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, jobId, onRatingSubmitted }) => {
    const [rating, setRating] = useState(0);
    const { rateJob, isRating } = useRateJob();

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            return;
        }
        const success = await rateJob(jobId, rating);
        if (success) {
            onRatingSubmitted();
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Your Experience</h2>
                    <p className="text-gray-600 mb-8">How would you rate the service you received?</p>
                    <StarRating onChange={handleRatingChange} />
                </div>
                <div className="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Skip
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isRating || rating === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
                    >
                        {isRating ? <Loader2 size={16} className="animate-spin" /> : null}
                        {isRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
