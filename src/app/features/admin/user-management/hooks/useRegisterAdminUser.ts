import { useState } from "react";
import { registerAdminUser } from "../services/AdminUserService";
import { User } from "@/app/shared/types/User";

export function useRegisterAdminUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(user: User) {
    setLoading(true);
    setError(null);
    try {
      return await registerAdminUser(user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error };
}
