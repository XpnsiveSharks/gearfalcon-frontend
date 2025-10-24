
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerService } from "@/app/_shared/services/CustomerService";
import PrimaryButton from "@/app/_shared/components/PrimaryButton";

const CompleteProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: "",
    contact: "",
    address: {
      house_number: "",
      street: "",
      barangay: "",
      city: "",
      province: "",
      region: "",
      postal_code: "",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await CustomerService.completeProfile(formData);
      router.push("/customer");
    } catch {
      setError("Failed to complete profile. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="mb-4 text-lg font-medium text-gray-800">Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="house_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  House Number
                </label>
                <input
                  type="text"
                  name="address.house_number"
                  id="house_number"
                  value={formData.address.house_number}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  id="street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="barangay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Barangay
                </label>
                <input
                  type="text"
                  name="address.barangay"
                  id="barangay"
                  value={formData.address.barangay}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  id="city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700"
                >
                  Province
                </label>
                <input
                  type="text"
                  name="address.province"
                  id="province"
                  value={formData.address.province}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  Region
                </label>
                <input
                  type="text"
                  name="address.region"
                  id="region"
                  value={formData.address.region}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  name="address.postal_code"
                  id="postal_code"
                  value={formData.address.postal_code}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <PrimaryButton type="submit" className="w-full">
            Submit
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
