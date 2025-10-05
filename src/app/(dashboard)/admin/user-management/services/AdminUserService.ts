import { User } from "@/app/_shared/types/User";
import { http } from "@/app/_shared/services/axiosClient";

// Type definitions for API responses
export type RegisterAdminUserResponse = {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export type AdminUserListResponse = {
  users: User[];
  total: number;
  page: number;
  limit: number;
};

export type AdminUserResponse = {
  user: User;
};

// Centralized Admin User Service using axios
export const AdminUserService = {
  // Register new admin user
  async registerAdminUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<RegisterAdminUserResponse> {
    const { data } = await http.post<RegisterAdminUserResponse>("/api/admin/users", {
      ...userData,
      role: "Admin"
    });
    return data;
  },

  // Get all admin users with pagination
  async getAdminUsers(page: number = 1, limit: number = 10): Promise<AdminUserListResponse> {
    const { data } = await http.get<AdminUserListResponse>("/api/admin/users", {
      params: { page, limit }
    });
    return data;
  },

  // Get specific admin user by ID
  async getAdminUserById(id: number): Promise<AdminUserResponse> {
    const { data } = await http.get<AdminUserResponse>(`/api/admin/users/${id}`);
    return data;
  },

  // Update admin user
  async updateAdminUser(id: number, userData: Partial<User>): Promise<AdminUserResponse> {
    const { data } = await http.put<AdminUserResponse>(`/api/admin/users/${id}`, userData);
    return data;
  },

  // Delete admin user
  async deleteAdminUser(id: number): Promise<{ success: boolean; message: string }> {
    const { data } = await http.delete<{ success: boolean; message: string }>(`/api/admin/users/${id}`);
    return data;
  }
};

// Legacy function for backward compatibility (deprecated - use AdminUserService.registerAdminUser instead)
export async function registerAdminUser(user: User): Promise<any> {
  return AdminUserService.registerAdminUser(user);
}