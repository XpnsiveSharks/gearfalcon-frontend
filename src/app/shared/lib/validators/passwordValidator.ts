/**
 * Password Strength Validator for GEARFALCON - TypeScript Version
 * Used by both Admin and Customer registration/password change
 */

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

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true
};

// Common weak passwords to block
const COMMON_PASSWORDS: readonly string[] = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 
  'password123', 'admin', 'letmein', 'welcome', '1234567890',
  'gearfalcon', 'aircon', 'service', 'customer', 'admin123'
] as const;

// Regular expressions for password validation
const REGEX_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numbers: /[0-9]/,
  specialChars: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/,
  commonSequence: /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
  repeatedChars: /(.)\1{2,}/,
  keyboard: /(qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)/i
} as const;

/**
 * Validates password strength and returns detailed feedback
 * @param password - The password to validate
 * @param options - Optional configuration overrides
 * @returns Validation result with score, isValid, and feedback
 */
export function validatePasswordStrength(
  password: string, 
  options: Partial<PasswordRequirements> = {}
): ValidationResult {
  const config: PasswordRequirements = { ...DEFAULT_PASSWORD_REQUIREMENTS, ...options };
  const feedback: string[] = [];
  let score = 0;
  let isValid = true;

  // Check if password exists
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      strength: 'invalid',
      feedback: ['Password is required'],
      requirements: getRequirementsList('', config)
    };
  }

  // Length validation
  if (password.length < config.minLength) {
    feedback.push(`Password must be at least ${config.minLength} characters long`);
    isValid = false;
  } else if (password.length >= config.minLength) {
    score += 10;
  }

  if (password.length > config.maxLength) {
    feedback.push(`Password must not exceed ${config.maxLength} characters`);
    isValid = false;
  }

  // Character type requirements
  if (config.requireUppercase && !REGEX_PATTERNS.uppercase.test(password)) {
    feedback.push('Password must contain at least one uppercase letter (A-Z)');
    isValid = false;
  } else if (REGEX_PATTERNS.uppercase.test(password)) {
    score += 15;
  }

  if (config.requireLowercase && !REGEX_PATTERNS.lowercase.test(password)) {
    feedback.push('Password must contain at least one lowercase letter (a-z)');
    isValid = false;
  } else if (REGEX_PATTERNS.lowercase.test(password)) {
    score += 15;
  }

  if (config.requireNumbers && !REGEX_PATTERNS.numbers.test(password)) {
    feedback.push('Password must contain at least one number (0-9)');
    isValid = false;
  } else if (REGEX_PATTERNS.numbers.test(password)) {
    score += 15;
  }

  if (config.requireSpecialChars && !REGEX_PATTERNS.specialChars.test(password)) {
    feedback.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[]\\/)');
    isValid = false;
  } else if (REGEX_PATTERNS.specialChars.test(password)) {
    score += 15;
  }

  // Common password check
  if (config.preventCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    feedback.push('This password is too common. Please choose a more unique password');
    isValid = false;
    score -= 20;
  }

  // Pattern-based weaknesses (warnings, not strict requirements)
  if (REGEX_PATTERNS.commonSequence.test(password)) {
    feedback.push('⚠️ Avoid common sequences like "123" or "abc" for better security');
    score -= 10;
  }

  if (REGEX_PATTERNS.repeatedChars.test(password)) {
    feedback.push('⚠️ Avoid repeating characters like "aaa" for better security');
    score -= 10;
  }

  if (REGEX_PATTERNS.keyboard.test(password)) {
    feedback.push('⚠️ Avoid keyboard patterns like "qwerty" for better security');
    score -= 10;
  }

  // Bonus points for length
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Bonus for character diversity
  const uniqueChars = new Set(password.toLowerCase()).size;
  if (uniqueChars >= password.length * 0.7) score += 10;

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  const strength = getPasswordStrength(score);

  return {
    isValid,
    score,
    strength,
    feedback: feedback.length > 0 ? feedback : ['Password meets all requirements'],
    requirements: getRequirementsList(password, config)
  };
}

/**
 * Get password strength category based on score
 * @param score - Password strength score
 * @returns Strength category
 */
function getPasswordStrength(score: number): PasswordStrength {
  if (score >= 80) return 'very-strong';
  if (score >= 60) return 'strong';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'weak';
  return 'very-weak';
}

/**
 * Get requirements checklist for UI display
 * @param password - Current password
 * @param config - Configuration object
 * @returns Array of requirement objects
 */
function getRequirementsList(password: string, config: PasswordRequirements): ValidationRequirement[] {
  return [
    {
      id: 'length',
      label: `At least ${config.minLength} characters`,
      met: password.length >= config.minLength,
      required: true
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter (A-Z)',
      met: REGEX_PATTERNS.uppercase.test(password),
      required: config.requireUppercase
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter (a-z)',
      met: REGEX_PATTERNS.lowercase.test(password),
      required: config.requireLowercase
    },
    {
      id: 'numbers',
      label: 'One number (0-9)',
      met: REGEX_PATTERNS.numbers.test(password),
      required: config.requireNumbers
    },
    {
      id: 'special',
      label: 'One special character (!@#$%^&*)',
      met: REGEX_PATTERNS.specialChars.test(password),
      required: config.requireSpecialChars
    },
    {
      id: 'common',
      label: 'Not a common password',
      met: !COMMON_PASSWORDS.includes(password.toLowerCase()),
      required: config.preventCommonPasswords
    }
  ].filter(req => req.required);
}

/**
 * Generate a secure password suggestion
 * @returns A randomly generated secure password
 */
export function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  
  // Ensure at least one character from each required set
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill remaining length with random characters
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Admin-specific password requirements
export const ADMIN_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  ...DEFAULT_PASSWORD_REQUIREMENTS,
  minLength: 12,
  maxLength: 128
};

// Customer-specific password requirements (same as default but explicit)
export const CUSTOMER_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  ...DEFAULT_PASSWORD_REQUIREMENTS,
  minLength: 8
};

/**
 * Predefined validation configs for different user types
 */
export const PASSWORD_CONFIGS = {
  customer: CUSTOMER_PASSWORD_REQUIREMENTS,
  admin: ADMIN_PASSWORD_REQUIREMENTS,
  technician: ADMIN_PASSWORD_REQUIREMENTS,
  supervisor: ADMIN_PASSWORD_REQUIREMENTS,
  manager: ADMIN_PASSWORD_REQUIREMENTS
} as const;

export type UserType = keyof typeof PASSWORD_CONFIGS;