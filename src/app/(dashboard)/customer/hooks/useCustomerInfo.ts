"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomerService } from "@/app/_shared/services/CustomerService";
import { User } from "@/app/_shared/types/User";
import { useAuth } from "@/app/_shared/hooks/useAuth";
import { AxiosError } from "axios";

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

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
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        router.push("/customer/complete-profile");
      } else {
        setError("Failed to fetch customer information.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCustomerInfo();
    }
  }, [isAuthenticated, isAuthLoading, router, refreshTrigger]);

  const refreshCustomerInfo = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { customerInfo, loading, error, refreshCustomerInfo };
};