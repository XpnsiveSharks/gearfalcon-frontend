/**
 * Checks if a string is a valid email address.
 * @param email string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // simple regex for most email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
