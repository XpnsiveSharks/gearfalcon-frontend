export type UserRole = "Customer" | "Technician" | "Admin";

export interface User {
  id?: string; // UUID, optional for new users

  // Role & status
  role: UserRole;
  is_active?: boolean;

  // Profile fields
  first_name: string;
  last_name: string;
  middle_name?: string;
  avatar_url?: string;

  // Contact Info
  phone?: string;

  // Credentials
  email: string;
  password?: string;      // for new users only, plaintext in frontend
  password_hash?: string; 

  // Address fields
  house_number: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;

  // Metadata (mostly backend)
  created_at?: string; // ISO timestamp
  updated_at?: string;
  deleted_at?: string | null;
}
