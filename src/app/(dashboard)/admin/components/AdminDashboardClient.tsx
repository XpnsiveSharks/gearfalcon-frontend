"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { JwtPayload } from '@/app/_shared/lib/jwt';
import { Calendar, Clock, DollarSign, Star, UserPlus, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import BookingManagement from './BookingManagement';
import ReportsAnalytics from './ReportsAnalytics';
import ServiceAndSkillsManagement from './ServiceAndSkillsManagement';
import UserManagement from './UserManagement';
import RefundsManagement from './RefundsManagement';
import useOverview from './Hooks/useOverview';

interface AdminDashboardClientProps {
  user: JwtPayload;
}

// A simple, reusable Modal component
const Modal = ({ isOpen, onClose, title, children }: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode 
}) => {
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
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const AddUserModal = ({ isOpen, onClose, onUserAdded }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onUserAdded: () => void 
}) => {
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
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Name" 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Password" 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          placeholder="Phone" 
          className="w-full p-2 border rounded" 
        />
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="w-full p-2 border rounded"
        >
          <option value="technician">Technician</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center"
          >
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
  id: number;
  customerName: string;
  serviceName: string;
  status: string;
  amount: string;
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
  const [showRevenue, setShowRevenue] = useState(false);
  const router = useRouter();

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const { recentJobs, activeBookingCount, totalBookingCount, totalRevenue, averageJobReview, loading, error } = useOverview();

  const tabs = [
    'Overview',
    'Bookings',
    'Users',
    'Services & Skills',
    'Refunds',
    'Reports',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'claimed':
        return 'bg-indigo-100 text-indigo-700';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-gray-100 text-gray-700';
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
    setHasDragged(false);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tabsContainerRef.current) return;
    e.preventDefault();
    setHasDragged(true);
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTabClick = (tab: string) => {
    if (hasDragged) {
      return;
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
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  {loading ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900"><Loader2 className="animate-spin" /></h3>
                  ) : error ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-red-500">Error</h3>
                  ) : (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{totalBookingCount}</h3>
                  )}
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Calendar className="text-blue-500" size={24} />
                </div>
              </div>
              {loading ? (
                <p className="text-sm text-gray-500 font-medium">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-medium">Failed to load data</p>
              ) : (
                <p className="text-sm text-gray-500 font-medium">Total bookings</p>
              )}
            </div>

            {/* Active Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                  {loading ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900"><Loader2 className="animate-spin" /></h3>
                  ) : error ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-red-500">Error</h3>
                  ) : (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{activeBookingCount}</h3>
                  )}
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Clock className="text-orange-500" size={24} />
                </div>
              </div>
              {loading ? (
                <p className="text-sm text-gray-500 font-medium">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-medium">Failed to load data</p>
              ) : (
                <p className="text-sm text-gray-500 font-medium">Currently active bookings</p>
              )}
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  {loading ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900"><Loader2 className="animate-spin" /></h3>
                  ) : error ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-red-500">Error</h3>
                  ) : (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {showRevenue ? `₱${totalRevenue.toLocaleString()}` : '********'}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowRevenue(!showRevenue)} className="p-2 rounded-full hover:bg-gray-100">
                    {showRevenue ? <EyeOff size={24} className="text-gray-500" /> : <Eye size={24} className="text-gray-500" />}
                  </button>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                </div>
              </div>
              {loading ? (
                <p className="text-sm text-gray-500 font-medium">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-medium">Failed to load data</p>
              ) : (
                <p className="text-sm text-gray-500 font-medium">Total revenue generated</p>
              )}
            </div>

            {/* Customer Rating */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer Rating</p>
                  {loading ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900"><Loader2 className="animate-spin" /></h3>
                  ) : error ? (
                    <h3 className="text-3xl md:text-4xl font-bold text-red-500">Error</h3>
                  ) : (
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{averageJobReview.toFixed(1)}</h3>
                  )}
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
              </div>
              {loading ? (
                <p className="text-sm text-gray-500 font-medium">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-medium">Failed to load data</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">Excellent service rating</p>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Bookings</h2>
            <div className="space-y-4 overflow-y-auto max-h-96">
              {loading ? (
                <p className="text-sm text-gray-500 text-center py-4">Loading recent bookings...</p>
              ) : error ? (
                <p className="text-sm text-red-500 text-center py-4">{error}</p>
              ) : recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{job.customer.user.name}</h4>
                      <p className="text-sm text-gray-600">{job.service.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 w-16 text-right">₱{job.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent bookings.</p>
              )}
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