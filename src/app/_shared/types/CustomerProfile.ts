export interface CustomerProfile {
  company_name: string;
  contact: string;
  address: {
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    postal_code: string;
  };
}
