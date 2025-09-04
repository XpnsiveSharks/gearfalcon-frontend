/**
 * GEARFALCON Password Validation - Type Definitions
 * Centralized type definitions for password validation system
 */

// Core password validation types
export interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
}

export interface ValidationRequirement {
  id: 'length' | 'uppercase' | 'lowercase' | 'numbers' | 'special' | 'common';
  label: string;
  met: boolean;
  required: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  strength: PasswordStrength;
  feedback: string[];
  requirements: ValidationRequirement[];
}

export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong' | 'invalid';

// User types for GEARFALCON system
export type UserType = 'customer' | 'admin' | 'technician' | 'supervisor' | 'manager';

export type UserRole = 'customer' | 'technician' | 'supervisor' | 'manager' | 'admin';

// Hook return types
export interface PasswordValidationState {
  validation: ValidationResult | null;
  isValidating: boolean;
  isValid: boolean;
  strength: PasswordStrength;
  score: number;
  feedback: string[];
  requirements: ValidationRequirement[];
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

// Component prop types
export interface PasswordStrengthIndicatorProps {
  password: string;
  onPasswordChange: (password: string) => void;
  placeholder?: string;
  label?: string;
  showGenerator?: boolean;
  showRequirements?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  userType?: UserType;
  validationOptions?: Partial<PasswordRequirements>;
  // Standard HTML input attributes
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
}

// Form data types
export interface BaseFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CustomerFormData extends BaseFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AdminFormData extends BaseFormData {
  username: string;
  role: UserRole;
}

export interface SubmitMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

// API response types (for future backend integration)
export interface PasswordValidationApiResponse {
  isValid: boolean;
  strength: PasswordStrength;
  score: number;
  requirements: ValidationRequirement[];
  suggestions?: string[];
}

export interface RegistrationApiRequest {
  userType: UserType;
  formData: CustomerFormData | AdminFormData;
  passwordData: PasswordSubmissionData;
}

export interface RegistrationApiResponse {
  success: boolean;
  message: string;
  userId?: string;
  verificationRequired?: boolean;
  errors?: string[];
}

// Configuration types
export interface PasswordConfigByUserType {
  customer: PasswordRequirements;
  admin: PasswordRequirements;
  technician: PasswordRequirements;
  supervisor: PasswordRequirements;
  manager: PasswordRequirements;
}

// Event handler types
export type PasswordChangeHandler = (password: string) => void;
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
export type InputChangeHandler<T> = <K extends keyof T>(field: K, value: T[K]) => void;

// Validation function types
export type PasswordValidator = (
  password: string, 
  options?: Partial<PasswordRequirements>
) => ValidationResult;

export type PasswordGenerator = () => string;

// Hook types
export type UsePasswordValidation = (
  password?: string,
  options?: Partial<PasswordRequirements> | UserType
) => PasswordValidationState;

export type UsePasswordConfirmation = (
  password: string,
  confirmPassword: string
) => PasswordConfirmationState;

export type UsePasswordForm = (
  password?: string,
  confirmPassword?: string,
  options?: Partial<PasswordRequirements> | UserType
) => PasswordFormState;

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredPasswordProps = Required<Pick<PasswordStrengthIndicatorProps, 'password' | 'onPasswordChange'>>;

// Constants types
export type CommonPassword = string;
export type RegexPattern = RegExp;

// Color mapping types
export type StrengthColorMap = {
  [K in PasswordStrength]: string;
};

// Aria attributes for accessibility
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'role'?: string;
}

// Error types
export interface ValidationError extends Error {
  field: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface FormValidationErrors {
  [field: string]: string | ValidationError;
}

// Theme/styling types
export interface PasswordThemeConfig {
  colors: {
    primary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
}

// Export utility type guards
export interface TypeGuards {
  isValidPasswordStrength: (strength: string) => strength is PasswordStrength;
  isUserType: (type: string) => type is UserType;
  isValidationResult: (obj: unknown) => obj is ValidationResult;
}

// Re-export common React types for convenience
import type {
  FunctionComponent,
  FormEvent as ReactFormEvent,
  ChangeEvent as ReactChangeEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
export type FC<P = {}> = FunctionComponent<P>;
export type FormEvent = ReactFormEvent<HTMLFormElement>;
export type ChangeEvent = ReactChangeEvent<HTMLInputElement>;
export type MouseEvent = ReactMouseEvent<HTMLButtonElement>;


// Branded types for additional type safety
export type SecurePassword = string & { readonly __brand: 'SecurePassword' };
export type HashedPassword = string & { readonly __brand: 'HashedPassword' };
export type UserId = string & { readonly __brand: 'UserId' };

// Factory functions for branded types
export const createSecurePassword = (password: string): SecurePassword => {
  // This would include validation in real implementation
  return password as SecurePassword;
};

export const createUserId = (id: string): UserId => {
  return id as UserId;
};

// Meta types for development
export interface PasswordValidationMeta {
  version: string;
  lastUpdated: Date;
  supportedUserTypes: UserType[];
  defaultRequirements: PasswordRequirements;
}

// Testing types
export interface PasswordTestCase {
  password: string;
  expectedStrength: PasswordStrength;
  expectedScore: number;
  expectedValid: boolean;
  description: string;
  userType?: UserType;
}

export interface ValidationTestSuite {
  name: string;
  tests: PasswordTestCase[];
  setup?: () => void;
  teardown?: () => void;
}