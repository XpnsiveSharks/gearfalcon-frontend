/**
 * Password Strength Validator for GEARFALCON - TypeScript Version
 * Used by both Admin and Customer registration/password change
 */

// Import the shared UserType (adjust the import path as needed)
import type { UserType } from '../../types/password.types'; // Adjust path to your shared types

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
  const special = '!@#$%^&*()_-=[]{}|;:,.<>?';

  const cryptoObj = getWebCrypto();
  if (!cryptoObj) {
    // As a last resort, fall back with a clear warning. Prefer environments with Web Crypto.
    // eslint-disable-next-line no-console
    console.warn('Web Crypto API unavailable; falling back to non-crypto RNG for password suggestion.');
  }

  const pick = (pool: string) =>
    pool[cryptoObj ? secureRandomInt(pool.length, cryptoObj) : Math.floor(Math.random() * pool.length)];

  const chars: string[] = [];
  // Ensure at least one from each class
  chars.push(pick(uppercase), pick(lowercase), pick(numbers), pick(special));

  // Fixed: Added '+' operators for string concatenation
  const allChars = uppercase + lowercase + numbers + special;
  while (chars.length < 12) chars.push(pick(allChars));

  // Fisher–Yates
  if (cryptoObj) {
    secureShuffle(chars, cryptoObj);
  } else {
    for (let i = chars.length - 1; i > 0; i--) {
      // Fixed: Added '+' operator
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
  }
  return chars.join('');
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
 * This will ensure type safety - adding a new UserType will require adding a config here
 */
export const PASSWORD_CONFIGS: Record<UserType, PasswordRequirements> = {
  customer: CUSTOMER_PASSWORD_REQUIREMENTS,
  admin: ADMIN_PASSWORD_REQUIREMENTS,
  technician: ADMIN_PASSWORD_REQUIREMENTS,
  supervisor: ADMIN_PASSWORD_REQUIREMENTS,
  manager: ADMIN_PASSWORD_REQUIREMENTS
} as const;

// Helpers for CSPRNG and unbiased shuffling
function getWebCrypto(): Crypto | undefined {
  // Browser
  // @ts-ignore - Crypto is available in DOM lib
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) return globalThis.crypto as Crypto;
  // Node.js fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { webcrypto } = require('node:crypto');
    return webcrypto as Crypto;
  } catch {
    return undefined;
  }
}

function secureRandomInt(maxExclusive: number, cryptoObj: Crypto): number {
  if (maxExclusive <= 0) throw new Error('maxExclusive must be > 0');
  const maxUint32 = 0xffffffff;
  const limit = Math.floor((maxUint32 + 1) / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    cryptoObj.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % maxExclusive;
}

function secureShuffle<T>(arr: T[], cryptoObj: Crypto): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1, cryptoObj);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}