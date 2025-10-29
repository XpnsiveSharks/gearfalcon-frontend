"use client";

import { useState, useEffect } from 'react';
import { http } from '@/app/_shared/services/axiosClient';

export interface CartItem {
  id: number;
  service_id: number;
  quantity: number;
  notes: string | null;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        // The API response is nested under a 'data' object.
        const response = await http.get<{ data: { items: CartItem[] } }>('/customers/cart');
        setCartItems(response.data?.data?.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  return { cartItems, loading, error };
};