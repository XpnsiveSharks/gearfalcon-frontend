"use client";

import React from 'react';
import { Download, Plus, Eye, Edit, MessageSquare, Star } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: number;
  lastService: string;
  rating: number;
  status: 'active' | 'inactive';
}

const CustomerManagement: React.FC = () => {
  // This data should eventually be fetched from an API
  const customers: Customer[] = [];

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Bookings</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Spent</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Service</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {customers.length > 0 ? (
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
                  <td className="p-4 block lg:table-cell" data-label="Location">
                    <span className="text-sm text-gray-900">{customer.location}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Total Bookings">
                    <span className="text-sm font-medium text-gray-900">{customer.totalBookings}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Total Spent">
                    <span className="text-sm font-medium text-gray-900">₱{customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Last Service">
                    <span className="text-sm text-gray-900">{customer.lastService}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Rating">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Actions">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Message"><MessageSquare size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={9}>No customers found.</td>
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