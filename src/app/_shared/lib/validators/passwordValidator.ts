// Password validation utilities
export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';

export interface PasswordRequirements {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export type UserType = 'customer' | 'admin' | 'technician' | 'supervisor' | 'manager';

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  score: number;
  requirements: Array<{
    id: string;
    label: string;
    met: boolean;
  }>;
  feedback: string[];
}

export function validatePasswordStrength(password: string, options: PasswordRequirements = {}): PasswordValidationResult {
  const requirements: PasswordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    ...options
  };

  const checks = {
    length: password.length >= requirements.minLength!,
    uppercase: !requirements.requireUppercase || /[A-Z]/.test(password),
    lowercase: !requirements.requireLowercase || /[a-z]/.test(password),
    numbers: !requirements.requireNumbers || /\d/.test(password),
    special: !requirements.requireSpecialChars || /[^a-zA-Z0-9]/.test(password)
  };

  const metRequirements = Object.values(checks).filter(Boolean).length;
  const totalRequirements = Object.keys(checks).length;

  // Calculate score (0-100)
  let score = (metRequirements / totalRequirements) * 100;

  // Bonus points for length
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Bonus for complexity
  const complexity = [checks.uppercase, checks.lowercase, checks.numbers, checks.special].filter(Boolean).length;
  score += (complexity - 2) * 5; // Bonus for having more than 2 types

  score = Math.min(100, Math.max(0, score));

  // Determine strength
  let strength: PasswordStrength;
  if (score < 20) strength = 'very-weak';
  else if (score < 40) strength = 'weak';
  else if (score < 60) strength = 'medium';
  else if (score < 80) strength = 'strong';
  else strength = 'very-strong';

  const requirementList = [
    { id: 'length', label: `At least ${requirements.minLength} characters`, met: checks.length },
    { id: 'uppercase', label: 'Contains uppercase letter', met: checks.uppercase },
    { id: 'lowercase', label: 'Contains lowercase letter', met: checks.lowercase },
    { id: 'numbers', label: 'Contains number', met: checks.numbers },
    { id: 'special', label: 'Contains special character', met: checks.special }
  ];

  const feedback: string[] = [];
  if (!checks.length) feedback.push(`Password must be at least ${requirements.minLength} characters long`);
  if (!checks.uppercase && requirements.requireUppercase) feedback.push('Add uppercase letters');
  if (!checks.lowercase && requirements.requireLowercase) feedback.push('Add lowercase letters');
  if (!checks.numbers && requirements.requireNumbers) feedback.push('Add numbers');
  if (!checks.special && requirements.requireSpecialChars) feedback.push('Add special characters');

  return {
    isValid: metRequirements === totalRequirements,
    strength,
    score,
    requirements: requirementList,
    feedback
  };
}

export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}