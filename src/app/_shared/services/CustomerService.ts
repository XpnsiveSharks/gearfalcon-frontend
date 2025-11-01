import { http } from "./axiosClient";
import { User } from "../types/User";
import { CustomerProfile } from "../types/CustomerProfile";

interface CustomerInfoResponse {
  success: boolean;
  customer: User;
}

export const CustomerService = {
  getCustomerInfo: async (): Promise<User> => {
    const response = await http.get<CustomerInfoResponse>("auth/customer-info");
    return response.data.customer;
  },

  completeProfile: async (data: CustomerProfile): Promise<CustomerProfile> => {
    const response = await http.post<CustomerProfile>("customers/complete-profile", data);
    return response.data;
  },
};
