
import { useState, useEffect } from 'react';
import {http}  from '@/app/_shared/services/axiosClient';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Customer {
  id: number;
  user_id: string;
  company_name: string;
  contact: string;
  user: CustomerUser;
}

interface Service {
  id: number;
  name: string;
  base_price: string;
}

interface CustomerAddress {
  id: number;
  house_number: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
}

interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Technician {
  id: number;
  user_id: string;
  specialization: string;
  certification: string;
  experience_years: number;
  contact: string;
  user: TechnicianUser;
}

interface Assignment {
  id: number;
  job_id: number;
  technician_id: number;
  assigned_at: string;
  technician: Technician;
}

export interface RecentJob {
  id: number;
  customer_id: number;
  customer_address_id: number;
  service_id: number;
  cart_id: number;
  status: string;
  scheduled_date: string;
  completed_date: string | null;
  notes: string;
  review: number | null;
  customer: Customer;
  service: Service;
  customer_address: CustomerAddress;
  assignments: Assignment[];
  price: number;
}

interface OverviewData {
  recent_jobs: RecentJob[];
}

interface BookingCountData {
  active_booking_count: number;
}

interface TotalBookingCountData {
  total_job_count: number;
}

interface TotalRevenueData {
  total_revenue: number;
}

interface AverageJobReviewData {
  average_job_review: number;
}

const useOverview = () => {
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [activeBookingCount, setActiveBookingCount] = useState<number>(0);
  const [totalBookingCount, setTotalBookingCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [averageJobReview, setAverageJobReview] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const [recentJobsResponse, activeBookingCountResponse, totalBookingCountResponse, totalRevenueResponse, averageJobReviewResponse] = await Promise.all([
          http.get<OverviewData>('/admin/overviews/recents'),
          http.get<BookingCountData>('/admin/overviews/active_booking'),
          http.get<TotalBookingCountData>('/admin/overviews/booking'),
          http.get<TotalRevenueData>('/admin/overviews/revenue'),
          http.get<AverageJobReviewData>('/admin/overviews/review'),
        ]);
        setRecentJobs(recentJobsResponse.data.recent_jobs);
        setActiveBookingCount(activeBookingCountResponse.data.active_booking_count);
        setTotalBookingCount(totalBookingCountResponse.data.total_job_count);
        setTotalRevenue(totalRevenueResponse.data.total_revenue);
        setAverageJobReview(averageJobReviewResponse.data.average_job_review);
      } catch (err) {
        setError('Failed to fetch overview data.');
        console.error('Error fetching overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  return { recentJobs, activeBookingCount, totalBookingCount, totalRevenue, averageJobReview, loading, error };
};

export default useOverview;
