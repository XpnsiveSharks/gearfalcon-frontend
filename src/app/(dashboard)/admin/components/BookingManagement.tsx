"use client";

import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  customer: string;
  phone: string;
  service: string;
  location: string;
  date: string;
  time: string;
  status: 'confirmed' | 'in-progress' | 'completed';
  payment: 'paid' | 'partial' | 'pending';
  amount: number;
}

const BookingManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // This data should eventually be fetched from an API
  const bookings: Booking[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
        
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-initial px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex-1 md:flex-initial px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Download size={18} />
            Export
          </button>
          <button className="flex-1 md:flex-initial px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} />
            New Booking
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Booking ID</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                <tr key={booking.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none hover:bg-gray-50 transition-colors">
                  <td className="p-4 block lg:table-cell" data-label="Booking ID">
                    <span className="text-sm font-medium text-gray-900">{booking.id}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Customer">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.customer}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Service">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.service}</p>
                      <p className="text-xs text-gray-500">{booking.location}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Date & Time">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Payment">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(booking.payment)}`}>
                      {booking.payment}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Amount">
                    <span className="text-sm font-semibold text-gray-900">₱{booking.amount.toLocaleString()}</span>
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
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={8}>No bookings found.</td>
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

export default BookingManagement;

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