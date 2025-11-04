"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  status: 'active' | 'inactive';
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const API_URL = '/admin/users';

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(API_URL);
      const apiUsers = response.data.users || [];

      const formattedUsers: User[] = apiUsers.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.deleted_at ? 'inactive' : 'active',
      }));
      
      setUsers(formattedUsers);
    } catch (err: any) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchUsers();
    }
  }, [isAuthLoading, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
}