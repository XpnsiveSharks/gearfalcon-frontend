"use client";

import React, { useState } from 'react';
import { Download, Plus, Eye, Edit, MessageSquare, Loader2, X } from 'lucide-react';
import { useCustomers } from './Hooks/useCustomers';

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

const CustomerManagement: React.FC = () => {
  const { customers, loading, error, customerDetails, detailsLoading, detailsError, fetchCustomerById } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: 'active' | 'inactive') => {
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

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h1>
        
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-initial justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
          <button className="flex-1 md:flex-initial justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-18rem)]">
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
              ) : customers.length > 0 ? (
                customers.map((customer) => (
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
                      <p className="text-xs text-gray-500">{customer.phone}</p>
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
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Message"><MessageSquare size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={4}>No customers found.</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
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
    </div>
  );
};

export default CustomerManagement;

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