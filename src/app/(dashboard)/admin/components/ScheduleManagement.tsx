"use client";

import React, { useMemo } from 'react';
import { Plus, Clock, MapPin, User, Phone, Calendar, UserPlus, MessageSquare, FileText, Loader2 } from 'lucide-react';
import { useJobs, Job } from './Hooks/useJobs';
import { useTechnicians } from './Hooks/useTechnicians';

const ScheduleManagement: React.FC = () => {
  const { takenJobs, loading: jobsLoading, error: jobsError } = useJobs();
  const { technicians, loading: techniciansLoading, error: techniciansError } = useTechnicians();

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

  const scheduledJobs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return takenJobs
      .filter(job => job.scheduledDate)
      .sort((a, b) => {
        const dateA = new Date(a.scheduledDate!).getTime();
        const dateB = new Date(b.scheduledDate!).getTime();
        return dateA - dateB;
      });
  }, [takenJobs]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
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
              <h2 className="text-xl font-bold text-gray-900 mb-1 px-1">Upcoming Scheduled Jobs</h2>
              <p className="text-sm text-gray-500">Sorted by the nearest date</p>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 h-[calc(100vh-22rem)]">
              {jobsLoading.taken ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              ) : jobsError.taken ? (
                <div className="text-center text-red-500 text-sm p-4">{jobsError.taken}</div>
              ) : scheduledJobs.length > 0 ? (
                scheduledJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">{job.serviceName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{job.customerName}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{formatDate(job.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{job.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{job.technicianName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{job.customerContact}</span>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No upcoming jobs scheduled.</p>
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
              {techniciansLoading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              ) : techniciansError ? (
                <div className="text-center text-red-500 text-sm p-2">{techniciansError}</div>
              ) : technicians.length > 0 ? (
                technicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{tech.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(tech.status)}`}>{tech.status}</span>
                </div>
              ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No technician data found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;