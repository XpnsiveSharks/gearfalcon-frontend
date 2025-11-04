"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Calendar, Clock, Star, Phone, StarIcon, Navigation, MapPin, User, Loader2, Award, Briefcase, Mail, Edit, BriefcaseBusiness, FileText, X } from 'lucide-react';
import { useTechnicianJobs, Job } from './hooks/useTechnicianJobs'; // Keep Job import
import { useTechnicianReview } from './hooks/useTechnicianReview';
import { useAvailableJobs} from './hooks/useAvailableJobs';

// Moved to a separate file, but keeping imports here for other components on this page
import { useTechnicianProfile } from './hooks/useTechnicianProfile';
import { validatePasswordStrength } from '@/app/_shared/lib/validators/passwordValidator';
import { useTechnicianServiceHistory } from './hooks/useTechnicianServiceHistory';
import PasswordStrengthIndicator from '@/app/_shared/components/PasswordStrengthIndicator';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-400">N/A</span>}</p>
    </div>
  </div>
);

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: (data: any) => Promise<any>;
}> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    contact: '',
    specialization: '',
    experience_years: '',
    certification: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        contact: profile.phone || '',
        specialization: profile.specialization || '',
        experience_years: profile.experience_years || '',
        certification: profile.certification || '',
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdate({
        ...formData,
        experience_years: Number(formData.experience_years) || 0,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Contact Number</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Years of Experience</label>
              <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Certification</label>
              <textarea name="certification" value={formData.certification} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex justify-end items-center p-6 border-t gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 disabled:bg-yellow-200 flex items-center">
              {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const { profile, loading, error, changePassword, updateProfile } = useTechnicianProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="ml-4 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-sm border border-red-200">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500">Could not load profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500">Technician Profile</p>
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
          <DetailItem icon={<Mail size={16} />} label="Email" value={profile.email} />
          <DetailItem icon={<Phone size={16} />} label="Phone" value={profile.phone} />
          <DetailItem icon={<Star size={16} />} label="Specialization" value={profile.specialization} />
          <DetailItem icon={<Award size={16} />} label="Certification" value={profile.certification} />
          <DetailItem icon={<Briefcase size={16} />} label="Experience" value={profile.experience_years ? `${profile.experience_years} years` : null} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3 mt-8">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.length > 0 ? profile.skills.map((skill, index) => <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">{skill.name}</span>) : <p className="text-sm text-gray-400">No skills assigned.</p>}
          </div>
        </div>
      </div>
      <ChangePasswordView changePassword={changePassword} />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={updateProfile}
      />
    </div>
  );
};

const ChangePasswordView: React.FC<{ changePassword: Function }> = ({ changePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    const validationResult = validatePasswordStrength(newPassword);
    if (!validationResult.isValid) {
      setError("New password does not meet the strength requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setSuccess("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError((err as any).message || 'An unexpected error occurred.');
      console.error("Change password error:", err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Current Password</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>
        <div>
          <PasswordStrengthIndicator password={newPassword} onPasswordChange={setNewPassword} label="New Password" userType="technician" required />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 flex items-center">
          {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const UpcomingJobsView: React.FC<{ jobs: Job[], loading: boolean, error: string | null }> = ({ jobs, loading, error }) => {
  const upcomingJobs = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return jobs
      .filter(job => {
        const jobDate = new Date(job.date);
        return jobDate >= tomorrow && job.status !== 'completed';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="ml-4 text-gray-500">Loading upcoming jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-sm border border-red-200">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Upcoming Jobs</h2>
      {upcomingJobs.length > 0 ? (
        <div className="space-y-4">
          {upcomingJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900">{job.service}</h3>
              <p className="text-sm text-gray-700 mb-1">Customer: {job.customerName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2"><Calendar size={16} /> {job.date} at {job.time}</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"><p className="text-gray-500">No upcoming jobs found.</p></div>
      )}
    </div>
  );
};

const JobBoardView: React.FC<{ onJobClaimed: () => void }> = ({ onJobClaimed }) => {
  const { availableJobs, loading, error, claimJob } = useAvailableJobs();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (jobId: string) => {
    if (window.confirm("Are you sure you want to claim this job? This action cannot be undone.")) {
      setClaimingId(jobId);
      const success = await claimJob(jobId);
      if (success) {
        alert('Job claimed successfully! It will now appear in your schedule.');
        onJobClaimed();
      } else {
        alert('Failed to claim job. It may have already been taken.');
      }
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="ml-4 text-gray-500">Loading available jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-sm border border-red-200">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Job Board</h2>
      {availableJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              {job.isPriority && <span className="px-3 py-1 mb-3 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase self-start">PRIORITY</span>}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{job.serviceName}</h3>
              <div className="space-y-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {job.location}</div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {job.date}</div>
                <div className="flex items-start gap-2"><FileText size={16} className="text-gray-400 mt-0.5" /> <p className="line-clamp-2">{job.notes}</p></div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">₱{job.serviceFee.toLocaleString()}</span>
                <button onClick={() => handleClaim(job.id)} disabled={!!claimingId} className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:bg-gray-400">
                  {claimingId === job.id ? <Loader2 size={16} className="animate-spin" /> : <BriefcaseBusiness size={16} />}
                  {claimingId === job.id ? 'Claiming...' : 'Claim Job'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"><p className="text-gray-500">No jobs currently available on the job board.</p></div>
      )}
    </div>
  );
};

const CompletedJobsView: React.FC = () => {
  const { completedJobs, loading, error } = useTechnicianServiceHistory();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="ml-4 text-gray-500">Loading service history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-sm border border-red-200">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Completed Jobs</h2>
      {completedJobs.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Completed</th>
                <th className="p-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{job.service}</td>
                  <td className="p-4 text-gray-600">{job.customerName}</td>
                  <td className="p-4 text-gray-600">{job.completedDate}</td>
                  <td className="p-4 text-right font-semibold text-gray-800">₱{job.serviceFee.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"><p className="text-gray-500">No completed jobs found.</p></div>
      )}
    </div>
  );
};


const TechnicianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const { jobs, loading, error } = useTechnicianJobs();  
  const { completedJobs } = useTechnicianServiceHistory();
  const { averageReview } = useTechnicianReview();

  const todaysJobs = useMemo(() => {
    const todayString = new Date().toLocaleDateString('en-CA'); // Gets date in 'YYYY-MM-DD' format

    return jobs
      .filter(job => job.date === todayString)
      .map(job => ({ ...job, isEmergency: true }));
  }, [jobs]);

  const stats = useMemo(() => {
    const todayString = new Date().toLocaleDateString('en-CA');
    
    const upcomingJobsCount = jobs.filter(job => job.date > todayString).length;
    const completedTodayCount = completedJobs.filter(job => new Date(job.completedDate).toLocaleDateString('en-CA') === todayString).length;

    return [
      { label: "Today's Jobs", value: String(todaysJobs.length), subtext: `${completedTodayCount} completed`, icon: Calendar, color: 'blue' },
      { label: 'Upcoming Jobs', value: String(upcomingJobsCount), subtext: 'Scheduled ahead', icon: Clock, color: 'purple' },
      { label: 'Total Completed', value: String(completedJobs.length), subtext: 'All-time completed jobs', icon: Award, color: 'green' },
      { label: 'Rating', value: averageReview !== null || averageReview === undefined ? String(averageReview) : 'N/A', subtext: 'Your Reviews! Keep Working', icon: StarIcon, color: 'yellow' }
    ]; 
  }, [jobs, todaysJobs, completedJobs, averageReview]);
  
  const getStatColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-50 border-red-100';
      case 'blue': return 'bg-blue-50 border-blue-100';
      case 'purple': return 'bg-purple-50 border-purple-100';
      case 'yellow': return 'bg-yellow-50 border-yellow-100';
      case 'green': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'blue': return 'text-blue-500';
      case 'purple': return 'text-purple-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Technician Dashboard</h1>
        <p className="text-gray-600">Manage your service appointments and track your performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-2xl shadow-sm border p-6 ${getStatColor(stat.color)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                  <Icon className={getIconColor(stat.color)} size={24} />
                </div>
              </div>
              <p className={`text-xs ${stat.color === 'red' ? getTextColor(stat.color) : 'text-gray-600'} font-medium`}>
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl md:rounded-full shadow-sm mb-6 p-2 flex flex-wrap md:flex-nowrap gap-2">
        {[
          { id: 'today', label: "Today's Jobs", badge: jobs.filter(j => j.isEmergency).length || null },
          { id: 'upcomingJob', label: 'Upcoming Jobs' },
          { id: 'JobBoard', label: 'JobBoard' },
          { id: 'completed', label: 'Completed' },
          { id: 'profile', label: 'Profile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-grow md:flex-1 px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all relative ${
              activeTab === tab.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {(() => {
        if (activeTab === 'profile') {
          return <ProfileView />;
        }
        if (activeTab === 'JobBoard') {
          return <JobBoardView onJobClaimed={() => { /* Optionally refetch assigned jobs */ }} />;
        }
        if (activeTab === 'upcomingJob') {
          return <UpcomingJobsView jobs={jobs} loading={loading} error={error} />;
        }
        if (activeTab === 'completed') {
          return <CompletedJobsView />;
        }
        if (activeTab === 'today') {
          return (
            <>
              {/* Schedule Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Today's Schedule - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
              </div>

              {!loading && todaysJobs.some(job => job.isEmergency) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Emergency Service Required</h3>
                    <p className="text-sm text-red-700">You have {todaysJobs.filter(j => j.isEmergency).length} emergency job(s) that require immediate attention.</p>
                  </div>
                </div>
              )}

              {/* Job Cards */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                    <p className="ml-4 text-gray-500">Loading jobs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-sm border border-red-200">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                ) : todaysJobs.length > 0 ? (
                  todaysJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{job.customerName}</h3>
                            {job.isEmergency && (
                              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                                Emergency
                              </span>
                            )}
                            {!job.isEmergency && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Scheduled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{job.service}</p>
                          <p className="text-xs text-gray-500">{job.jobId}</p>
                        </div>
                        {job.isEmergency && (
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg flex items-center gap-1">
                            <Navigation size={14} />
                            En route
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <Calendar size={16} className="text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{job.date}</p>
                            <p className="text-xs text-gray-500">{job.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{job.location}</p>
                            <p className="text-xs text-gray-500">{job.fullAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-900">{job.phone}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <User size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-900">{job.previousServices} previous services</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Notes:</span> {job.notes}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-sm text-gray-600">Service Fee: </span>
                          <span className="text-lg font-bold text-gray-900">₱{job.serviceFee}</span>
                          {job.serviceFee === 600 && (
                            <span className="text-xs text-gray-500 ml-2">(Inspection)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">No jobs scheduled for today.</p>
                  </div>
                )}
              </div>
            </>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default TechnicianDashboard;
  