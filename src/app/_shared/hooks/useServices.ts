import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  base_price: string;
}

export const useServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catResponse, srvResponse] = await Promise.all([
        axios.get(`${API_URL}catalog/categories`),
        axios.get(`${API_URL}catalog/services`)
      ]);
      setCategories(catResponse.data);
      setServices(srvResponse.data);
    } catch (err) {
      console.error("Failed to fetch services or categories", err);
      setError("Failed to load service data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { categories, services, loading, error, refetch: fetchData };
};