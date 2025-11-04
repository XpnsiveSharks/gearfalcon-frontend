import { useState, useEffect } from 'react';
import { http } from '@/app/_shared/services/axiosClient';

interface TechnicianReview {
    technician_id: number;
    average_review: number;
}

export const useTechnicianReview = () => {
    const [averageReview, setAverageReview] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTechnicianReview = async () => {
            try {
                const response = await http.get<TechnicianReview>('/technicians/review');
                setAverageReview(response.data.average_review);
            } catch (err) {
                setError('Failed to fetch technician review.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTechnicianReview();
    }, []);

    return { averageReview, isLoading, error };
};
