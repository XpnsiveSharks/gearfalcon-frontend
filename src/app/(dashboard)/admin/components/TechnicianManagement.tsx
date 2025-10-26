"use client";

import React from 'react';
import { Plus, Eye, Edit, Wrench, Star } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  status: 'busy' | 'available' | 'offline';
  rating: number;
  jobsCompleted: number;
  location: string;
}

const TechnicianManagement: React.FC = () => {
  // This data should eventually be fetched from an API
  const technicians: Technician[] = [];

  const getStatusColor = (status: string) => {
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
        
        <button className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Add Technician
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Technician</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialties</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jobs Completed</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {technicians.length > 0 ? (
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
                      {tech.specialties.map((specialty, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{specialty}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)}`}>{tech.status}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Rating">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{tech.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Jobs Completed">
                    <span className="text-sm font-medium text-gray-900">{tech.jobsCompleted}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Location">
                    <span className="text-sm text-gray-900">{tech.location}</span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Actions">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Assign Job"><Wrench size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={8}>No technicians found.</td>
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