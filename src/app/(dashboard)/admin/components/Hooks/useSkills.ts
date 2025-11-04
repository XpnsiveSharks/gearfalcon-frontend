"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

interface ApiSkill {
  id: number;
  name: string;
  description: string | null;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface AddSkillData {
  name: string;
  description?: string;
}

export interface UpdateSkillData {
  name?: string;
  description?: string;
}


export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const API_URL = '/admin/skills';

  const fetchSkills = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(API_URL);
      const apiSkills: ApiSkill[] = response.data || [];
      const formattedSkills: Skill[] = apiSkills.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || 'No description provided.',
      }));
      setSkills(formattedSkills);
    } catch (err: any) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchSkills();
    }
  }, [isAuthLoading, fetchSkills]);

  const addSkill = async (skillData: AddSkillData) => {
    if (!isAuthenticated) throw new Error("User is not authenticated.");
    try {
      const response = await http.post(API_URL, skillData);
      const newSkill: ApiSkill = response.data;
      setSkills(prev => [...prev, {
        id: newSkill.id,
        name: newSkill.name,
        description: newSkill.description || 'No description provided.'
      }]);
    } catch (err) {
      throw new Error(axiosUtils.getErrorMessage(err));
    }
  };

  const updateSkill = async (id: number, skillData: UpdateSkillData) => {
    if (!isAuthenticated) throw new Error("User is not authenticated.");
    try {
      await http.put(`${API_URL}/${id}`, skillData);
      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...skillData, description: skillData.description || s.description } : s));
    } catch (err) {
      throw new Error(axiosUtils.getErrorMessage(err));
    }
  };

  const deleteSkill = async (id: number) => {
    if (!isAuthenticated) throw new Error("User is not authenticated.");
    try {
      await http.delete(`${API_URL}/${id}`);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw new Error(axiosUtils.getErrorMessage(err));
    }
  };

  return {
    skills,
    loading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
}