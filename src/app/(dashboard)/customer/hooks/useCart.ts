"use client";

import { useState, useEffect } from 'react';
import { http } from '@/app/_shared/services/axiosClient';
import { toast } from 'react-toastify';

// Define the Service interface based on your provided data structure
export interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string;
  base_price: string; // Keep as string, convert to number when needed
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Define the CartItem interface, including the nested Service
export interface CartItem {
  id: number;
  cart_id: number;
  service_id: number;
  quantity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service: Service; // Each cart item now includes its service details
}

// Define the structure of the cart data itself from the API response
export interface CartData {
  id: number;
  customer_id: number;
  status: string;
  items: CartItem[];
  total_price: number;
}

// Define the full API response structure
interface ApiResponse {
  data: CartData;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to manually trigger a re-fetch

  const fetchCart = async () => {
    try {
      setLoading(true);
      // The API response is nested under a 'data' object, and then the actual cart data.
      const response = await http.get<ApiResponse>('/customers/cart');
      setCartItems(response.data?.data?.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const removeItem = async (itemId: number): Promise<boolean> => {
    try {
      // Assuming your API has an endpoint like /customers/cart/items/{itemId} for deletion
      await http.delete(`/customers/cart/items/${itemId}`);
      toast.success('Item removed from cart!');
      setRefreshTrigger(prev => prev + 1); // Trigger a re-fetch of the cart
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove item from cart.';
      toast.error(errorMessage);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      await http.delete('/customers/cart');
      toast.success('All items removed from cart!');
      setRefreshTrigger(prev => prev + 1); // Trigger a re-fetch of the cart
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to clear cart.';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateItem = async (itemId: number, quantity: number, notes: string): Promise<boolean> => {
    try {
      await http.put(`/customers/cart/items/${itemId}`, { quantity, notes });
      toast.success('Cart item updated successfully!');
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update cart item.';
      toast.error(errorMessage);
      return false;
    }
  };

  return { cartItems, loading, error, removeItem, clearCart, updateItem };
};