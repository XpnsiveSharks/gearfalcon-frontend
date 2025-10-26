"use client";

import React from 'react';
import { Plus, Clock, MapPin, User, Phone, Calendar, UserPlus, MessageSquare, FileText } from 'lucide-react';

interface ScheduleItem {
  title: string;
  customer: string;
  time: string;
  location: string;
  technician: string;
  phone: string;
  status: 'confirmed' | 'in-progress' | 'pending';
}

interface TechnicianAvailability {
  name: string;
  status: 'busy' | 'available';
}

const ScheduleManagement: React.FC = () => {
  const todaySchedule: ScheduleItem[] = [];

  const technicians: TechnicianAvailability[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'busy':
        return 'bg-orange-100 text-orange-700';
      case 'available':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Schedule Management</h1>
        
        <button className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Schedule Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Today's Schedule</h2>
              <p className="text-sm text-gray-500">August 5, 2024</p>
            </div>

            <div className="space-y-4">
              {todaySchedule.length > 0 ? (
                todaySchedule.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{item.customer}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{item.technician}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{item.phone}</span>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No items scheduled for today.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Technician Availability */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-xl transition-colors flex items-center gap-3"><Calendar size={18} />View Calendar</button>
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-xl transition-colors flex items-center gap-3"><UserPlus size={18} />Assign Technician</button>
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-xl transition-colors flex items-center gap-3"><MessageSquare size={18} />Send SMS Update</button>
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-xl transition-colors flex items-center gap-3"><FileText size={18} />Generate Report</button>
            </div>
          </div>

          {/* Technician Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Technician Availability</h2>
            
            <div className="space-y-3">
              {technicians.length > 0 ? (
                technicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{tech.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(tech.status)}`}>{tech.status}</span>
                </div>
              ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No technician data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;