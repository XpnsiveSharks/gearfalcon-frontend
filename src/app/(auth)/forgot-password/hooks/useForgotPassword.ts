import { useState } from "react";
import { AuthService } from "@/app/_shared/services/AuthService";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: email, 2: code/password, 3: result

  const handleRequestCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.forgotPassword(email);
      setSuccessMessage(response.message);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (
    email: string,
    code: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.resetPassword(email, code, password);
      setSuccessMessage(response.message);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    successMessage,
    step,
    handleRequestCode,
    handleResetPassword,
  };
};
