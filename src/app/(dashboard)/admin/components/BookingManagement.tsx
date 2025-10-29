"use client";

import React from 'react';
import { AlertTriangle, Briefcase, CheckCircle, Clock, MapPin, Phone, User, Wrench, Loader2 } from 'lucide-react';
import { useJobs, Job } from './Hooks/useJobs';

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <p className="text-sm font-bold text-gray-800">{job.serviceName}</p>
        <span className="text-xs font-mono text-gray-500">#{job.id}</span>
      </div>
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span>{job.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400" />
          <span>{job.customerContact}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-gray-400 mt-0.5" />
          <span className="flex-1">{job.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span>{formatDate(job.scheduledDate)}</span>
        </div>
        {job.technicianName && (
          <div className="flex items-center gap-2">
            <Wrench size={14} className="text-gray-400" />
            <span className="font-medium">{job.technicianName}</span>
          </div>
        )}
      </div>
      {job.notes && (
        <div className="text-xs text-gray-500 italic border-t border-gray-100 pt-2">
          &quot;{job.notes}&quot;
        </div>
      )}
    </div>
  );
};

const JobColumn: React.FC<{ title: string; icon: React.ReactNode; jobs: Job[]; loading: boolean; error: string | null; }> = ({ title, icon, jobs, loading, error }) => (
  <div className="bg-gray-100/60 rounded-2xl p-4 flex flex-col">
    <div className="flex items-center gap-3 mb-4 px-2">
      {icon}
      <h2 className="text-base font-bold text-gray-800">{title}</h2>
      <span className="text-sm font-semibold text-gray-500">{jobs.length}</span>
    </div>
    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-sm p-4">{error}</div>
      ) : jobs.length > 0 ? (
        jobs.map(job => <JobCard key={`${title}-${job.id}`} job={job} />)
      ) : (
        <div className="text-center text-gray-500 text-sm p-4">No jobs found.</div>
      )}
    </div>
  </div>
);

const BookingManagement: React.FC = () => {
  const { emergencyJobs, takenJobs, availableJobs, loading, error } = useJobs();

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
      </div>

      {/* Job Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">
          <JobColumn 
            title="Emergency Jobs" 
            icon={<AlertTriangle className="text-red-500" />} 
            jobs={emergencyJobs} 
            loading={loading.emergency} 
            error={error.emergency} 
          />
          <JobColumn 
            title="Taken Jobs" 
            icon={<CheckCircle className="text-blue-500" />} 
            jobs={takenJobs} 
            loading={loading.taken} 
            error={error.taken} 
          />
          <JobColumn 
            title="Available Jobs" 
            icon={<Briefcase className="text-green-500" />} 
            jobs={availableJobs} 
            loading={loading.available} 
            error={error.available} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;