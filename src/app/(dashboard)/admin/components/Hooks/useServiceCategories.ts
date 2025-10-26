import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/_shared/hooks/useAuth';
import { http } from '@/app/_shared/services/axiosClient';

export interface ServiceCategory {
  id: number;
  name:string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AddCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  base_price: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AddServiceData {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
}

export interface UpdateServiceData {
  category_id?: number;
  name?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
}

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const CATEGORIES_API_URL = '/admin/categories';
  const SERVICES_API_URL = '/admin/services';

  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await http.get<ServiceCategory[]>(CATEGORIES_API_URL);
      if (response.status !== 200) {
        throw new Error('Failed to fetch service categories. Please try again later.');
      }
      setCategories(response.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addCategory = async (categoryData: AddCategoryData) => {
    try {
      const response = await http.post<ServiceCategory>(CATEGORIES_API_URL, categoryData);
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to add the new category.');
      }
      await fetchCategories(); 
      return response.data;
    } catch (err: any) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const updateCategory = async (id: number, categoryData: UpdateCategoryData) => {
    const url = `${CATEGORIES_API_URL}/${id}`;
    try {
      const response = await http.put<ServiceCategory>(url, categoryData);
      if (response.status !== 200) {
        throw new Error('Failed to update the category.');
      }
      await fetchCategories();
    } catch (err: any) {
      console.error(`Error updating category ${id}:`, err);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    const url = `${CATEGORIES_API_URL}/${id}`;
    try {
      const response = await http.delete(url);
      if (response.status !== 200 && response.status !== 204) throw new Error('Failed to delete category.');
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err: any) {
      console.error(`Error deleting category ${id}:`, err);
      throw err;
    }
  };

  const fetchServices = useCallback(async () => {
    if (!isAuthenticated) {
      setServicesLoading(false);
      setServicesError("User is not authenticated.");
      return;
    }

    setServicesLoading(true);
    setServicesError(null);

    try {
      const response = await http.get<Service[]>(SERVICES_API_URL);
      if (response.status !== 200) {
        throw new Error('Failed to fetch services. Please try again later.');
      }
      setServices(response.data || []);
    } catch (err: any) {
      setServicesError(err.message);
    } finally {
      setServicesLoading(false);
    }
  }, [isAuthenticated]);

  const addService = async (serviceData: AddServiceData) => {
    try {
      const response = await http.post<Service>(SERVICES_API_URL, serviceData);
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to add the new service.');
      }
      await fetchServices();
      return response.data;
    } catch (err: any) {
      console.error("Error adding service:", err);
      throw err;
    }
  };

  const updateService = async (id: number, serviceData: UpdateServiceData) => {
    const url = `${SERVICES_API_URL}/${id}`;
    try {
      const response = await http.put<Service>(url, serviceData);
      if (response.status !== 200) {
        throw new Error('Failed to update the service.');
      }
      await fetchServices();
    } catch (err: any) {
      console.error(`Error updating service ${id}:`, err);
      throw err;
    }
  };

  const deleteService = async (id: number) => {
    const url = `${SERVICES_API_URL}/${id}`;
    try {
      const response = await http.delete(url);
      if (response.status !== 200 && response.status !== 204) throw new Error('Failed to delete service.');
      setServices(prev => prev.filter(srv => srv.id !== id));
    } catch (err: any) {
      console.error(`Error deleting service ${id}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCategories();
      fetchServices();
    }
  }, [isAuthLoading, fetchCategories, fetchServices]);

  return { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    services,
    servicesLoading,
    servicesError,
    fetchServices,
    addService,
    updateService,
    deleteService
  };
}
