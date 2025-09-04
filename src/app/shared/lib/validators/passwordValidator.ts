// lib/validators/passwordValidator.ts

// Allowed user roles
export type UserType = 'admin' | 'customer' | 'technician';

export interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  preventCommonPasswords: boolean;
}

export interface ValidationRequirement {
  id: string;
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

// Default config
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  preventCommonPasswords: true
};

// Common weak passwords to block
const COMMON_PASSWORDS = ['password', '123456', '12345678', 'qwerty', 'abc123'];

// Regex
const REGEX_PATTERNS = {
  uppercase2: /(?:.*[A-Z]){2,}/, // at least 2 uppercase letters
  lowercase: /[a-z]/,
};

// Validation
export function validatePasswordStrength(
  password: string,
  options: Partial<PasswordRequirements> = {}
): ValidationResult {
  const config: PasswordRequirements = { ...DEFAULT_PASSWORD_REQUIREMENTS, ...options };
  const feedback: string[] = [];
  let score = 0;
  let isValid = true;

  // Check length
  if (password.length < config.minLength) {
    feedback.push(`Password must be at least ${config.minLength} characters long`);
    isValid = false;
  } else {
    score += 20;
  }

  if (password.length > config.maxLength) {
    feedback.push(`Password must not exceed ${config.maxLength} characters`);
    isValid = false;
  }

  // Check uppercase (2 minimum)
  if (config.requireUppercase && !REGEX_PATTERNS.uppercase2.test(password)) {
    feedback.push('Password must contain at least 2 uppercase letters (A-Z)');
    isValid = false;
  } else if (REGEX_PATTERNS.uppercase2.test(password)) {
    score += 30;
  }

  // Check lowercase
  if (config.requireLowercase && !REGEX_PATTERNS.lowercase.test(password)) {
    feedback.push('Password must contain at least one lowercase letter (a-z)');
    isValid = false;
  } else if (REGEX_PATTERNS.lowercase.test(password)) {
    score += 20;
  }

  // Common password check
  if (config.preventCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    feedback.push('This password is too common');
    isValid = false;
    score -= 20;
  }

  // Strength category
  const strength = getPasswordStrength(score);

  return {
    isValid,
    score,
    strength,
    feedback: feedback.length ? feedback : ['Password meets all requirements'],
    requirements: getRequirementsList(password, config)
  };
}

function getPasswordStrength(score: number): PasswordStrength {
  if (score >= 70) return 'very-strong';
  if (score >= 50) return 'strong';
  if (score >= 30) return 'medium';
  if (score >= 15) return 'weak';
  return 'very-weak';
}

function getRequirementsList(password: string, config: PasswordRequirements): ValidationRequirement[] {
  return [
    {
      id: 'length',
      label: `At least ${config.minLength} characters`,
      met: password.length >= config.minLength,
      required: true
    },
    {
      id: 'uppercase2',
      label: 'At least 2 uppercase letters (A-Z)',
      met: /(?:.*[A-Z]){2,}/.test(password),
      required: config.requireUppercase
    },
    {
      id: 'lowercase',
      label: 'At least 1 lowercase letter (a-z)',
      met: /[a-z]/.test(password),
      required: config.requireLowercase
    },
    {
      id: 'common',
      label: 'Not a common password',
      met: !COMMON_PASSWORDS.includes(password.toLowerCase()),
      required: config.preventCommonPasswords
    }
  ];
}

// Configs per role
export const PASSWORD_CONFIGS: Record<UserType, PasswordRequirements> = {
  admin: { ...DEFAULT_PASSWORD_REQUIREMENTS, minLength: 8 },
  customer: { ...DEFAULT_PASSWORD_REQUIREMENTS, minLength: 8 },
  technician: { ...DEFAULT_PASSWORD_REQUIREMENTS, minLength: 8 },
};

// lib/validators/passwordValidator.ts

export function generateSecurePassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";

  // Ensure at least 2 uppercase
  for (let i = 0; i < 2; i++) {
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
  }

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle so the 2 uppercase aren’t always first
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
