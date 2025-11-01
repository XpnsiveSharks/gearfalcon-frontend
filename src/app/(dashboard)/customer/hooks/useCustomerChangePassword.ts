"use client";

import { useState } from 'react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import { validatePasswordStrength } from '@/app/_shared/lib/validators/passwordValidator';

interface ChangePasswordData {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useCustomerChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = async ({ userId, currentPassword, newPassword, confirmPassword }: ChangePasswordData): Promise<boolean> => {
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return false;
    }
    const validationResult = validatePasswordStrength(newPassword);
    if (!validationResult.isValid) {
      setError("New password does not meet the strength requirements.");
      return false;
    }

    setIsSubmitting(true);
    try {
      await http.put(`/customers/change-password/${userId}`, {
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setSuccess("Password changed successfully!");
      return true;
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { changePassword, isSubmitting, error, success, setError, setSuccess };
};