import { useState, useEffect, useMemo } from 'react';
import { 
  validatePasswordStrength, 
  PasswordRequirements, 
  ValidationResult,
  PasswordStrength,
  PASSWORD_CONFIGS
} from '../lib/validators/passwordValidator';

import {
  ValidationRequirement,
} from '../../shared/types/password.types';

// Import UserType from the shared types file (adjust path as needed)
import { UserType } from '../../shared/types/password.types'; // Adjust this path to match your project structure

export interface PasswordValidationState {
  validation: ValidationResult | null;
  isValidating: boolean;
  isValid: boolean;
  strength: PasswordStrength;
  score: number;
  feedback: string[];
  requirements: Array<{
    id: string;
    label: string;
    met: boolean;
    required: boolean;
  }>;
  hasError: boolean;
  isStrong: boolean;
  isVeryStrong: boolean;
  meetsMinimum: boolean;
}

export interface PasswordConfirmationState {
  isValid: boolean;
  message: string;
  hasError: boolean;
  isEmpty: boolean;
}

export interface PasswordFormState {
  password: PasswordValidationState;
  confirmation: PasswordConfirmationState;
  isFormValid: boolean;
  hasAnyErrors: boolean;
  canSubmit: boolean;
  getFormErrors: () => string[];
  getSubmissionData: () => PasswordSubmissionData;
}

export interface PasswordSubmissionData {
  password: string;
  isPasswordValid: boolean;
  passwordStrength: PasswordStrength;
  passwordScore: number;
}

/**
 * React hook for password validation with real-time feedback
 * Perfect for both admin and customer registration forms
 * 
 * @param password - The password to validate
 * @param options - Validation configuration options or user type
 * @returns Validation state and helpers
 */
export function usePasswordValidation(
  password: string = '', 
  options: Partial<PasswordRequirements> | UserType = {}
): PasswordValidationState {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Resolve options - if string (UserType) passed, use predefined config
  const resolvedOptions = useMemo(() => {
    if (typeof options === 'string') {
      return PASSWORD_CONFIGS[options];
    }
    return options;
  }, [options]);

  useEffect(() => {
    // Don't validate empty passwords
    if (!password || password.trim() === '') {
      setValidation(null);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    
    // Add slight delay for better UX during typing
    const timeoutId = setTimeout(() => {
      const result = validatePasswordStrength(password, resolvedOptions);
      setValidation(result);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [password, resolvedOptions]);

  return {
    validation,
    isValidating,
    isValid: validation?.isValid || false,
    strength: validation?.strength || 'very-weak',
    score: validation?.score || 0,
    feedback: validation?.feedback || [],
    requirements: validation?.requirements || [],
    // Helper methods
    hasError: validation !== null && !validation.isValid,
    isStrong: validation?.strength === 'strong',
    isVeryStrong: validation?.strength === 'very-strong',
    meetsMinimum: validation?.isValid || false,
  };
}

/**
 * Hook for password confirmation validation
 * Validates that password and confirmation match
 * 
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns Confirmation validation state
 */
export function usePasswordConfirmation(
  password: string, 
  confirmPassword: string
): PasswordConfirmationState {
  const [confirmationValidation, setConfirmationValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: true,
    message: ''
  });

  useEffect(() => {
    // Don't validate if either field is empty
    if (!password || !confirmPassword) {
      setConfirmationValidation({ isValid: true, message: '' });
      return;
    }

    const isMatch = password === confirmPassword;
    setConfirmationValidation({
      isValid: isMatch,
      message: isMatch ? 'Passwords match' : 'Passwords do not match'
    });
  }, [password, confirmPassword]);

  return {
    isValid: confirmationValidation.isValid,
    message: confirmationValidation.message,
    hasError: !confirmationValidation.isValid && confirmPassword.length > 0,
    isEmpty: !confirmPassword || confirmPassword.trim() === ''
  };
}

/**
 * Combined hook for complete password form validation
 * Handles both password strength and confirmation
 * 
 * @param password - Primary password
 * @param confirmPassword - Password confirmation
 * @param options - Validation options or user type
 * @returns Complete password form state
 */
export function usePasswordForm(
  password: string = '', 
  confirmPassword: string = '', 
  options: Partial<PasswordRequirements> | UserType = {}
): PasswordFormState {
  const passwordValidation = usePasswordValidation(password, options);
  const confirmationValidation = usePasswordConfirmation(password, confirmPassword);

  const isFormValid = passwordValidation.isValid && confirmationValidation.isValid;
  const hasAnyErrors = passwordValidation.hasError || confirmationValidation.hasError;
  const canSubmit = isFormValid && password.length > 0 && confirmPassword.length > 0;

  const getFormErrors = (): string[] => {
    const errors: string[] = [];
    if (passwordValidation.hasError) {
      errors.push(...passwordValidation.feedback);
    }
    if (confirmationValidation.hasError) {
      errors.push(confirmationValidation.message);
    }
    return errors;
  };

  const getSubmissionData = (): PasswordSubmissionData => ({
    password,
    isPasswordValid: passwordValidation.isValid,
    passwordStrength: passwordValidation.strength,
    passwordScore: passwordValidation.score
  });

  return {
    // Password strength validation
    password: passwordValidation,
    
    // Password confirmation validation
    confirmation: confirmationValidation,
    
    // Form-level validation
    isFormValid,
    hasAnyErrors,
    canSubmit,
    
    // Helper methods
    getFormErrors,
    getSubmissionData
  };
}

/**
 * Hook specifically for admin password validation
 * Uses enhanced security requirements
 */
export function useAdminPasswordValidation(password: string = '', confirmPassword: string = '') {
  return usePasswordForm(password, confirmPassword, 'admin');
}

/**
 * Hook specifically for customer password validation  
 * Uses standard security requirements
 */
export function useCustomerPasswordValidation(password: string = '', confirmPassword: string = '') {
  return usePasswordForm(password, confirmPassword, 'customer');
}

/**
 * Hook for dynamic user type password validation
 * Useful when user type is determined at runtime
 */
export function useUserTypePasswordValidation(
  password: string = '', 
  confirmPassword: string = '', 
  userType: UserType
) {
  return usePasswordForm(password, confirmPassword, userType);
}

export default usePasswordValidation;