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

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const API_URL = '/admin/categories'; // The base URL is handled by the axios client

  /**
   * 1. GET: Fetches all service categories (excluding soft-deleted ones).
   */
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log(`GET: ${API_URL}`);
    try {
      const response = await http.get<ServiceCategory[]>(API_URL);
      if (response.status !== 200) {
        throw new Error('Failed to fetch service categories. Please try again later.');
      }
      console.log('GET Response:', { status: response.status, data: response.data });
      setCategories(response.data || []);
    } catch (err: any) {
      console.error('GET Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Automatically fetch categories when the hook is first used.
  useEffect(() => {
    if (!isAuthLoading) {
      fetchCategories();
    }
  }, [isAuthLoading, fetchCategories]);

  /**
   * 2. POST: Adds a new service category.
   * @param categoryData - The data for the new category (name, description).
   */
  const addCategory = async (categoryData: AddCategoryData) => {
    console.log(`POST: ${API_URL}`, { body: categoryData });

    try {
      const response = await http.post<ServiceCategory>(API_URL, categoryData);
      console.log('POST Response:', { status: response.status, data: response.data });

      if (response.status !== 201 && response.status !== 200) { // Handle 201 Created or 200 OK
        throw new Error('Failed to add the new category.');
      }
      
      // Refresh the list to show the new category
      await fetchCategories(); 
      return response.data;
    } catch (err: any) {
      console.error("Error adding category:", err);
      throw err; // Re-throw the error to be handled by the component/form
    }
  };

  /**
   * 3. PUT: Updates an existing service category.
   * @param id - The ID of the category to update.
   * @param categoryData - The new data for the category.
   */
  const updateCategory = async (id: number, categoryData: UpdateCategoryData) => {
    const url = `${API_URL}/${id}`;
    console.log(`PUT: ${url}`, { body: categoryData });

    try {
      const response = await http.put<ServiceCategory>(url, categoryData);
      console.log('PUT Response:', { status: response.status, data: response.data });

      if (response.status !== 200) {
        throw new Error('Failed to update the category.');
      }

      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error(`Error updating category ${id}:`, err);
      throw err;
    }
  };

  /**
   * 4. DELETE: Soft-deletes a service category.
   * @param id - The ID of the category to soft-delete.
   */
  const deleteCategory = async (id: number) => {
    const url = `${API_URL}/${id}`;
    console.log(`DELETE: ${url}`);

    try {
      const response = await http.delete(url);

      console.log('DELETE Response Status:', response.status);
      if (response.status !== 200 && response.status !== 204) throw new Error('Failed to delete category.');
      
      // Optimistically remove from UI or refetch
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err: any) {
      console.error(`Error deleting category ${id}:`, err);
      throw err;
    }
  };

  return { categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory };
}