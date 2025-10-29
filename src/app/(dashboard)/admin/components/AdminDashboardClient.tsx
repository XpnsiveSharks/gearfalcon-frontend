"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { JwtPayload } from "@/app/_shared/lib/jwt";
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';
import CustomerManagement from './CustomerManagement';
import TechnicianManagement from './TechnicianManagement';
import BookingManagement from './BookingManagement';
import ScheduleManagement from './ScheduleManagement';
import ServiceManagement from './ServiceManagement';
import ReportsAnalytics from './ReportsAnalytics';
import SkillsManagement from './SkillsManagement';

interface AdminDashboardClientProps {
  user: JwtPayload;
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
  const router = useRouter();

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);


  const tabs = [
    'Overview',
    'Bookings',
    'Customers',
    'Technicians',
    'Services',
    'Schedule',
    'Skills',
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
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
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

      {activeTab === 'customers' && <CustomerManagement />}

      {activeTab === 'technicians' && <TechnicianManagement />}

      {activeTab === 'services' && <ServiceManagement />}

      {activeTab === 'schedule' && <ScheduleManagement />}

      {activeTab === 'skills' && <SkillsManagement />}

      {activeTab === 'reports' && <ReportsAnalytics />}
    </div>
  );
}