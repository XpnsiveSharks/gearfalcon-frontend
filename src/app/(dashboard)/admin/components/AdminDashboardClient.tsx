"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { JwtPayload } from '@/app/_shared/lib/jwt';
import { Calendar, Clock, DollarSign, Star, UserPlus, X, Loader2 } from 'lucide-react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import BookingManagement from './BookingManagement';
import ReportsAnalytics from './ReportsAnalytics';
import ServiceAndSkillsManagement from './ServiceAndSkillsManagement';
import UserManagement from './UserManagement';
import RefundsManagement from './RefundsManagement';

interface AdminDashboardClientProps {
  user: JwtPayload;
}

// A simple, reusable Modal component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
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
    role: 'technician',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="technician">Technician</option>
          <option value="customer">Customer</option>
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
}

type TimeRange = 'Last 7 days' | 'Last 30 days' | 'Last 90 days';

interface Booking {
  name: string;
  service: string;
  status: 'confirmed' | 'in-progress' | 'completed';
  amount: number;
}

interface Technician {
  name: string;
  specialties: string;
  status: 'busy' | 'available';
  jobs: number;
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 7 days');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const router = useRouter();

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);


  const tabs = [
    'Overview',
    'Bookings',
    'Users',
    'Services & Skills',
    'Refunds', // This was already here, which is great!
    'Reports',
  ];

  // Data should be fetched from an API
  const recentBookings: Booking[] = [];

  // Data should be fetched from an API
  const technicians: Technician[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'busy':
        return 'bg-orange-100 text-orange-700';
      case 'available':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tabsContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false); // Reset drag status on new mousedown
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tabsContainerRef.current) return;
    e.preventDefault();
    setHasDragged(true); // User is dragging
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // The multiplier makes scrolling feel more natural
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTabClick = (tab: string) => {
    if (hasDragged) {
      return; // Don't change tab if user was dragging
    }
    setActiveTab(tab.toLowerCase());
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={() => { /* TODO: Implement data refresh */ }}
      />

      {/* Welcome Header & Logout */}
      {/* Navigation Tabs */}
      <div
        ref={tabsContainerRef}
        className="bg-white rounded-full shadow-sm mb-8 p-2 flex gap-2 w-full overflow-x-auto cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 text-center whitespace-nowrap px-6 py-2 text-sm font-medium rounded-full transition-all ${
              activeTab === tab.toLowerCase()
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Business Overview</h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <button
                onClick={() => setAddUserModalOpen(true)}
                className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                <UserPlus size={18} /> Add User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">0</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Calendar className="text-blue-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">No data available</p>
            </div>

            {/* Active Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">0</h3>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Clock className="text-orange-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">No data available</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">₱0</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <DollarSign className="text-green-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">No data available</p>
            </div>

            {/* Customer Rating */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer Rating</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">N/A</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-green-600 font-medium">Excellent service rating</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Bookings</h2>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{booking.name}</h4>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 w-16 text-right">₱{booking.amount}</p>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent bookings.</p>
                )
                }
              </div>
            </div>

            {/* Technician Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Technician Status</h2>
              <div className="space-y-4">
                {technicians.length > 0 ? (
                  technicians.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{tech.name}</h4>
                      <p className="text-sm text-gray-600">{tech.specialties}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)}`}>
                        {tech.status}
                      </span>
                      <p className="text-sm text-gray-600 w-16 text-right">{tech.jobs} jobs</p>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No technicians to display.</p>
                )
                }
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bookings' && <BookingManagement />}

      {activeTab === 'users' && <UserManagement />}

      {activeTab === 'services & skills' && <ServiceAndSkillsManagement />}
      {activeTab === 'refunds' && <RefundsManagement />}

      {activeTab === 'reports' && <ReportsAnalytics />}
    </div>
  );
}
