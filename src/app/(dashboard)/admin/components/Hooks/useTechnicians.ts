"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

// Interface for the nested technician details from the API
interface TechnicianDetails {
  id: number;
  user_id: string;
  specialization: string | null;
  certification: string | null;
  experience_years: number | null;
  contact: string | null;
}

// Interface for the main user object from the API, which includes technician details
interface ApiTechnician {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  deleted_at: string | null;
  technician: TechnicianDetails;
}

// Interface for the data structure the component will use
export interface Technician {
  id: string;
  technicianId: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  certification: string;
  experience: number;
  status: 'available' | 'offline';
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const API_URL = '/admin/technicians';

  const fetchTechnicians = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(API_URL);
      const apiTechnicians: ApiTechnician[] = response.data || [];
      const formattedTechnicians: Technician[] = apiTechnicians.map(tech => ({
        id: tech.id,
        technicianId: tech.technician.id,
        name: tech.name,
        email: tech.email,
        phone: tech.technician.contact || 'N/A',
        specialties: tech.technician.specialization?.split(',').map(s => s.trim()) || [],
        certification: tech.technician.certification || 'N/A',
        experience: tech.technician.experience_years || 0,
        status: tech.deleted_at ? 'offline' : 'available',
      }));
      setTechnicians(formattedTechnicians);
    } catch (err: any) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchTechnicians();
    }
  }, [isAuthLoading, fetchTechnicians]);

  return { technicians, loading, error, fetchTechnicians };
}