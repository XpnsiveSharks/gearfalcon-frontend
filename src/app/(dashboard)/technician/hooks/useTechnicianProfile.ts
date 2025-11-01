"use client";

import { useState, useEffect, useCallback } from 'react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import { useAuth } from '@/app/_shared/hooks/useAuth';

export interface TechnicianProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  certification: string | null;
  experience_years: number | null;
  skills: { name: string }[];
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const useTechnicianProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // The API returns the technician object nested under a 'technician' key.
      const response = await http.get<{ technician: any }>(`/admin/technicians/${user.id}`);
      const techData = response.data.technician;

      setProfile({
        id: techData.user.id,
        name: techData.user.name,
        email: techData.user.email,
        phone: techData.user.phone,
        specialization: techData.specialization,
        certification: techData.certification,
        experience_years: techData.experience_years,
        skills: techData.skills || [],
      });
    } catch (err) {
      console.error("Failed to fetch technician profile:", err);
      setError('Failed to load your profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const changePassword = useCallback(async (passwordData: ChangePasswordData) => {
    if (!profile?.id) {
      throw new Error("Technician profile not loaded. Cannot change password.");
    }
    try {
      // The API endpoint for technicians to change their own password
      return await http.put(`/customers/change-password/${profile.id}`, passwordData);
    } catch (err) {
      // Re-throw a more user-friendly error message from the API response
      throw new Error(axiosUtils.getErrorMessage(err));
    }
  }, [profile?.id]);

  return { profile, loading, error, refetch: fetchProfile, changePassword };
};