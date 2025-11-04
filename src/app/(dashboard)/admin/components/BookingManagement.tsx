"use client";

import React, { useState } from 'react';
import { AlertTriangle, Briefcase, CheckCircle, Clock, MapPin, Phone, User, Wrench, Loader2, UserPlus, X, Plus } from 'lucide-react';
import { useJobs, Job } from './Hooks/useJobs';
import { useTechnicians } from './Hooks/useTechnicians';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

const AssignTechnicianModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
  onAssignSuccess: () => void;
}> = ({ isOpen, onClose, jobId, onAssignSuccess }) => {
  const { technicians, loading, error } = useTechnicians();
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!jobId || !selectedTechnicianId) {
      setAssignError("Please select a technician.");
      return;
    }

    setIsAssigning(true);
    setAssignError(null);

    try {
      await http.put(`/admin/jobs/${jobId}/assign/${selectedTechnicianId}`);
      onAssignSuccess();
      onClose();
    } catch (err) {
      setAssignError(axiosUtils.getErrorMessage(err));
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Assign Technician to Job #{jobId}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-6 max-h-80 overflow-y-auto">
          {loading && <div className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="space-y-3">
            {technicians.map(tech => (
              <label key={tech.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="technician" value={tech.technicianId} onChange={() => setSelectedTechnicianId(tech.technicianId)} className="mr-3" />
                <div>
                  <p className="font-medium">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t flex justify-end items-center gap-3">
          {assignError && <p className="text-sm text-red-600 mr-auto">{assignError}</p>}
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">Cancel</button>
          <button onClick={handleAssign} disabled={isAssigning} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2">
            {isAssigning && <Loader2 size={16} className="animate-spin" />} Assign
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: Job; columnTitle: string; onAssignClick: (jobId: number) => void; }> = ({ job, columnTitle, onAssignClick }) => {
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
      {columnTitle === 'Emergency Jobs' && (
        <div className="pt-3 border-t border-gray-100">
          <button onClick={() => onAssignClick(job.id)} className="w-full px-3 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
            <UserPlus size={14} />
            Assign a Technician
          </button>
        </div>
      )}
    </div>
  );
};

const JobColumn: React.FC<{ title: string; icon: React.ReactNode; jobs: Job[]; loading: boolean; error: string | null; onAssignClick: (jobId: number) => void; }> = ({ title, icon, jobs, loading, error, onAssignClick }) => (
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
        jobs.map(job => <JobCard key={`${title}-${job.id}`} job={job} columnTitle={title} onAssignClick={onAssignClick} />)
      ) : (
        <div className="text-center text-gray-500 text-sm p-4">No jobs found.</div>
      )}
    </div>
  </div>
);

const BookingManagement: React.FC = () => {
  const { emergencyJobs, takenJobs, availableJobs, loading, error, refetchJobs } = useJobs();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const handleOpenAssignModal = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedJobId(null);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="bg-gray-50 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
        <button className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Job
        </button>
      </div>

      <AssignTechnicianModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        jobId={selectedJobId}
        onAssignSuccess={() => {
          refetchJobs();
          alert('Technician assigned successfully!');
        }}
      />

      {/* Job Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-3 gap-6 h-[calc(100vh-18rem)]">
          <JobColumn
            title="Emergency Jobs"
            icon={<AlertTriangle className="text-red-500" />}
            jobs={emergencyJobs}
            loading={loading.emergency}
            error={error.emergency}
            onAssignClick={handleOpenAssignModal}
          />
          <JobColumn title="Taken Jobs" icon={<CheckCircle className="text-blue-500" />} jobs={takenJobs} loading={loading.taken} error={error.taken} onAssignClick={() => {}} />
          <JobColumn title="Available Jobs" icon={<Briefcase className="text-green-500" />} jobs={availableJobs} loading={loading.available} error={error.available} onAssignClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;