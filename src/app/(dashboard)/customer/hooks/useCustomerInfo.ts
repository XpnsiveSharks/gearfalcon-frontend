"use client";
import { useState, useEffect } from "react";
import { CustomerService } from "@/app/_shared/services/CustomerService";
import { User } from "@/app/_shared/types/User";
import { useAuth } from "@/app/_shared/hooks/useAuth";

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError("User is not authenticated.");
        return;
      }

      try {
        setLoading(true);
        const data = await CustomerService.getCustomerInfo();
        setCustomerInfo(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch customer information.");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchCustomerInfo();
    }
  }, [isAuthenticated, isAuthLoading]);

  return { customerInfo, loading, error };
};