"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Loader2, X, Search, UserPlus, Mail, Phone, Star, Award, Briefcase } from 'lucide-react';
import { useTechnicians } from './Hooks/useTechnicians';
import { useCustomers } from './Hooks/useCustomers';
import { http } from '@/app/_shared/services/axiosClient';

// Re-usable Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
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
  const { customers, loading, error } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const technicianUserIds = new Set(technicians.map(t => t.id));
    
    const promotableCustomers = customers.filter(
      customer => !technicianUserIds.has(customer.id)
    );

    if (!searchQuery) return promotableCustomers;

    return promotableCustomers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const handlePromote = async (userId: string) => {
    if (!window.confirm('Are you sure you want to promote this customer to a technician?')) return;

    setPromotingId(userId);
    try {
      await http.post('/admin/technicians/promote', { user_id: userId });
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
            phone: techData.user.phone,
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

const TechnicianManagement: React.FC = () => {
  const { technicians, loading, error, fetchTechnicians } = useTechnicians();
  const [isPromoteModalOpen, setPromoteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);

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

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Technician Management</h1>
        
        <button 
          onClick={() => setPromoteModalOpen(true)}
          className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Technician
        </button>
      </div>

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-18rem)]">
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
              ) : technicians.length > 0 ? (
                technicians.map((tech) => (
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
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete"><Trash2 size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={7}>No technicians found.</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TechnicianManagement;

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