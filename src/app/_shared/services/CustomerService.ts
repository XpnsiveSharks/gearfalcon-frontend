
import { http } from "./axiosClient";
import { User } from "../types/User";

export const CustomerService = {
  getCustomerInfo: async (): Promise<User> => {
    const response = await http.get<User>("auth/customer-info");
    return response.data;
  },
};
