import { http } from "./axiosClient";
import { User } from "../types/User";
import { CustomerProfile } from "../types/CustomerProfile";

export const CustomerService = {
  getCustomerInfo: async (): Promise<User> => {
    const response = await http.get<User>("auth/customer-info");
    return response.data;
  },

  completeProfile: async (data: CustomerProfile): Promise<CustomerProfile> => {
    const response = await http.post<CustomerProfile>("customers/complete-profile", data);
    return response.data;
  },
};
