"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {Plus, Eye, Edit, Loader2, X, Search, UserPlus, Mail, Phone, Star, Award, Briefcase, UserMinus } from 'lucide-react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import { useCustomers } from './Hooks/useCustomers';
import { useTechnicians } from './Hooks/useTechnicians';
import { useUsers } from './Hooks/useUsers';
import ProfilesManagementInternal from './ProfilesManagementInternal';
import { EditTechnicianModal } from './modals/EditTechnicianModal';

// A simple, reusable Modal component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const AddUserModal = ({ isOpen, onClose, onUserAdded }: { isOpen: boolean, onClose: () => void, onUserAdded: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await http.post('/admin/users', formData);
      alert('User added successfully!');
      onUserAdded();
      onClose();
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', password: '', role: 'customer', phone: '' });
      setError(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="customer">Customer</option>
          <option value="technician">Technician</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
};

const EditCustomerModal = ({ isOpen, onClose, customer, onUpdateSuccess }: { isOpen: boolean, onClose: () => void, customer: any | null, onUpdateSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    new_email: '',
    new_password: '',
    contact: '',
    house_number: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    region: '',
    postal_code: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        new_email: customer.email || '',
        new_password: '',
        contact: customer.phone || '',
        house_number: customer.address?.house_number || '',
        street: customer.address?.street || '',
        barangay: customer.address?.barangay || '',
        city: customer.address?.city || '',
        province: customer.address?.province || '',
        region: customer.address?.region || '',
        postal_code: customer.address?.postal_code || '',
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    const payload: any = {};
    const addressPayload: any = {};

    if (formData.name !== (customer.name || '')) payload.name = formData.name;
    if (formData.new_email !== (customer.email || '')) payload.new_email = formData.new_email;
    if (formData.contact !== (customer.contact || '')) payload.contact = formData.contact;
    if (formData.new_password) payload.new_password = formData.new_password;

    if (formData.house_number !== (customer.address?.house_number || '')) addressPayload.house_number = formData.house_number;
    if (formData.street !== (customer.address?.street || '')) addressPayload.street = formData.street;
    if (formData.barangay !== (customer.address?.barangay || '')) addressPayload.barangay = formData.barangay;
    if (formData.city !== (customer.address?.city || '')) addressPayload.city = formData.city;
    if (formData.province !== (customer.address?.province || '')) addressPayload.province = formData.province;
    if (formData.region !== (customer.address?.region || '')) addressPayload.region = formData.region;
    if (formData.postal_code !== (customer.address?.postal_code || '')) addressPayload.postal_code = formData.postal_code;

    if (Object.keys(addressPayload).length > 0) {
      // If any address field has changed, we need to provide the full address context
      // for validation or processing on the backend, so we merge existing with new.
      payload.address = {
        house_number: customer.address?.house_number || '',
        street: customer.address?.street || '',
        barangay: customer.address?.barangay || '',
        city: customer.address?.city || '',
        province: customer.address?.province || '',
        region: customer.address?.region || '',
        postal_code: customer.address?.postal_code || '',
        ...addressPayload
      };
    }

    if (Object.keys(payload).length === 0) {
        alert('No changes detected.');
        return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await http.put(`/admin/customers/${customer.id}`, payload);
      alert(`Customer updated successfully! Updated fields: ${response.data.updated_fields.join(', ')}`);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Customer: ${customer?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <input name="new_email" type="email" value={formData.new_email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="new_password" type="password" value={formData.new_password} onChange={handleChange} placeholder="New Password (optional)" className="w-full p-2 border rounded" />
        <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="w-full p-2 border rounded" />
        <h4 className="font-semibold pt-2">Address</h4>
        <input name="house_number" value={formData.house_number} onChange={handleChange} placeholder="House Number" className="w-full p-2 border rounded" />
        <input name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="w-full p-2 border rounded" />
        <input name="barangay" value={formData.barangay} onChange={handleChange} placeholder="Barangay" className="w-full p-2 border rounded" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
        <input name="province" value={formData.province} onChange={handleChange} placeholder="Province" className="w-full p-2 border rounded" />
        <input name="region" value={formData.region} onChange={handleChange} placeholder="Region" className="w-full p-2 border rounded" />
        <input name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" className="w-full p-2 border rounded" />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CustomerManagementInternal: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsers(); // For the main list
  const { customerDetails, detailsLoading, detailsError, fetchCustomerById, fetchCustomers } = useCustomers(); // For view/edit details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const customers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: 'active' | 'inactive' | string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewClick = (id: string) => {
    fetchCustomerById(id);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer: any) => {
    // We fetch fresh details for editing to ensure data is up-to-date
    fetchCustomerById(customer.id);
    // We can use the basic customer object to pre-fill the modal title while details load
    setSelectedCustomer(customer); 
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-gray-50">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-26rem)]">
        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {loading ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={4}>
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-red-500" colSpan={4}>
                    {error}
                  </td>
                </tr>
              ) : paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none hover:bg-gray-50 transition-colors">
                  <td className="p-4 block lg:table-cell" data-label="Customer">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.id}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Contact">
                    <div>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Actions">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewClick(customer.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={18} className="text-gray-600" /></button>
                      <button onClick={() => handleEditClick(customer)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={4}>
                    {searchTerm ? 'No customers match your search.' : 'No customers found.'}
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Customer Details">
        {detailsLoading ? (
          <div className="flex justify-center items-center gap-2 p-8">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-gray-600">Loading details...</span>
          </div>
        ) : customerDetails ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-md font-medium text-gray-900">{customerDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-md font-medium text-gray-900">{customerDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-md font-medium text-gray-900">{customerDetails.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-md font-medium text-gray-900">{customerDetails.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-md font-medium text-gray-900 capitalize">{customerDetails.status}</p>
              </div>
            </div>
        ) : <p className="text-red-500 text-center p-8">{detailsError || 'Could not load customer details.'}</p>
        }
      </Modal>

      {/* Edit Customer Modal */}
      <EditCustomerModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        // Pass the detailed data to the modal once it's loaded
        customer={customerDetails}
        onUpdateSuccess={() => {
          fetchUsers(); // Refresh the main user list
          fetchCustomers(); // Refresh the customer-specific data
        }}
      />
    </div>
  );
};

interface PromoteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromote: () => void;
  technicians: { id: string }[];
}

const PromoteCustomerModal: React.FC<PromoteCustomerModalProps> = ({ isOpen, onClose, onPromote, technicians }) => {
  const { users, loading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    // Filter for users who are customers
    const promotableCustomers = users.filter(user => user.role === 'customer');

    if (!searchQuery) return promotableCustomers;

    return promotableCustomers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handlePromote = async (userId: string) => {
    if (!window.confirm('Are you sure you want to promote this customer to a technician?')) return;

    setPromotingId(userId);
    try {
      await http.put(`/admin/technicians/promote/${userId}`);
      alert('Customer promoted successfully!');
      onPromote();
      onClose();
    } catch (err) {
      console.error('Promotion failed:', err);
      alert('Failed to promote customer. They may already be a technician or an error occurred.');
    } finally {
      setPromotingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Promote Customer to Technician">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {loading ? (
          <div className="text-center p-4"><Loader2 className="animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
              <button
                onClick={() => handlePromote(customer.id)}
                disabled={promotingId === customer.id}
                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 disabled:bg-gray-300"
              >
                {promotingId === customer.id ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                Promote
              </button>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-gray-500">No customers found.</p>
        )}
      </div>
    </Modal>
  );
};

interface TechnicianDetails {
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  certification: string | null;
  experience_years: number | null;
  skills: { name: string }[];
}

interface ViewTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianId: string | null;
}

const ViewTechnicianModal: React.FC<ViewTechnicianModalProps> = ({ isOpen, onClose, technicianId }) => {
  const [details, setDetails] = useState<TechnicianDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && technicianId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        setDetails(null);
        try {
          const response = await http.get(`/admin/technicians/${technicianId}`);
          const techData = response.data.technician;
          setDetails({
            name: techData.user.name,
            email: techData.user.email,
            phone: techData.contact,
            specialization: techData.specialization,
            certification: techData.certification,
            experience_years: techData.experience_years,
            skills: techData.skills || [],
          });
        } catch (err) {
          setError('Failed to fetch technician details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, technicianId]);

  const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-400">N/A</span>}</p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Technician Details">
      {loading && <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin" /></div>}
      {error && <div className="text-center text-red-500 p-8">{error}</div>}
      {details && (
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900">{details.name}</h4>
            <p className="text-sm text-gray-500">Technician Profile</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={<Mail size={16} />} label="Email" value={details.email} />
            <DetailItem icon={<Phone size={16} />} label="Phone" value={details.phone} />
            <DetailItem icon={<Star size={16} />} label="Specialization" value={details.specialization} />
            <DetailItem icon={<Award size={16} />} label="Certification" value={details.certification} />
            <DetailItem icon={<Briefcase size={16} />} label="Experience" value={details.experience_years ? `${details.experience_years} years` : null} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {details.skills.length > 0 ? (
                details.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {skill.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">No skills assigned.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const TechnicianManagementInternal: React.FC = () => {
  const { technicians, loading, error, fetchTechnicians } = useTechnicians();
  const [isPromoteModalOpen, setPromoteModalOpen] = useState(false);
  const promoteTechnician = () => setPromoteModalOpen(true);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTechnicians = useMemo(() => {
    if (!searchTerm) {
      return technicians;
    }
    return technicians.filter(tech =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tech.email && tech.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [technicians, searchTerm]);

  const paginatedTechnicians = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTechnicians.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTechnicians, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: 'available' | 'offline' | 'busy') => {
    switch (status) {
      case 'busy':
        return 'bg-orange-100 text-orange-700';
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'offline':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDemote = async (technicianId: string) => {
    if (window.confirm('Are you sure you want to demote this technician back to a customer?')) {
      try {
        await http.delete(`/admin/technicians/demote/${technicianId}`);
        alert('Technician demoted successfully.');
        fetchTechnicians();
      } catch (err) {
        console.error('Demotion failed:', err);
        alert('Failed to demote technician.');
      }
    }
  };

  const handleEditClick = (technicianId: string) => {
    setSelectedTechnicianId(technicianId);
    setEditModalOpen(true);
  };

  return (
    <div className="bg-gray-50">
      <button
        onClick={promoteTechnician}
        className="hidden" // This button is triggered from the parent
        id="promoteTechnicianBtn"
      />
      {/* Table Container */}
      <PromoteCustomerModal 
        isOpen={isPromoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        onPromote={fetchTechnicians}
        technicians={technicians}
      />
      <ViewTechnicianModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        technicianId={selectedTechnicianId}
      />
      <EditTechnicianModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        technicianId={selectedTechnicianId}
        onUpdateSuccess={() => {
          fetchTechnicians();
        }}
      />
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search technicians by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-26rem)]">
        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Technician</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialties</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Certification</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {loading ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={7}>
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Loading technicians...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-red-500" colSpan={7}>
                    {error}
                  </td>
                </tr>
              ) : paginatedTechnicians.length > 0 ? (
                paginatedTechnicians.map((tech) => (
                <tr key={tech.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none hover:bg-gray-50 transition-colors">
                  <td className="p-4 block lg:table-cell" data-label="Technician">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                      <p className="text-xs text-gray-500">{tech.id}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Contact">
                    <div>
                      <p className="text-sm text-gray-900">{tech.email}</p>
                      <p className="text-xs text-gray-500">{tech.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Specialties">
                    <div className="flex flex-wrap gap-1 justify-end lg:justify-start">
                      {tech.specialties.length > 0 ? tech.specialties.map((specialty, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{specialty}</span>
                      )) : <span className="text-xs text-gray-500">N/A</span>}
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Certification">
                    <span className="text-sm text-gray-900">{tech.certification}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Experience">
                    <span className="text-sm font-medium text-gray-900">{tech.experience} {tech.experience === 1 ? 'year' : 'years'}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)}`}>{tech.status}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Actions">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedTechnicianId(tech.id);
                          setViewModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={18} className="text-gray-600" /></button>
                      <button onClick={() => handleEditClick(tech.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>                      
                      <button onClick={() => handleDemote(tech.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Demote"><UserMinus size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={7}>
                    {searchTerm ? 'No technicians match your search.' : 'No technicians found.'}
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {paginatedTechnicians.length} of {filteredTechnicians.length} technicians
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  // We need access to the refetch functions to refresh the data
  const { fetchCustomers } = useCustomers();
  const { fetchTechnicians } = useTechnicians();
  const { fetchUsers } = useUsers();
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  const handleUserAdded = useCallback(() => {
    // Refetch data for the active tab
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'technicians') fetchTechnicians();
  }, [activeTab, fetchCustomers, fetchTechnicians, fetchUsers]);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-4">
          {activeTab === 'technicians' && (
            <button
              onClick={() => setIsPromoteModalOpen(true)}
              className="w-full md:w-auto justify-center px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Technician
            </button>
          )}
          <button
            onClick={() => setAddUserModalOpen(true)}
            className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'customers' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveTab('technicians')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'technicians' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Technicians
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'profiles' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Profiles
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'customers' && <CustomerManagementInternal />}
        {activeTab === 'technicians' && <TechnicianManagementInternal />}
        {activeTab === 'profiles' && <ProfilesManagementInternal />}
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <PromoteCustomerModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onPromote={fetchTechnicians}
        technicians={[]} // Pass empty array as we filter by role now
      />
    </div>
  );
}

export default UserManagement;

/* CSS for responsive table */
const styles = `
  @media (max-width: 1023px) {
    .responsive-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
      padding-left: 50%;
      position: relative;
    }
    .responsive-table td:before {
      content: attr(data-label);
      position: absolute;
      left: 1rem;
      width: 45%;
      padding-right: 0.5rem;
      white-space: nowrap;
      font-weight: 600;
      color: #4b5563;
      font-size: 0.75rem;
      line-height: 1rem;
    }
    .responsive-table tr:last-child td:last-child {
      border-bottom: 0;
    }
  }
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
