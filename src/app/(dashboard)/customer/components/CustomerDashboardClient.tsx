"use client";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import React, { useState, useMemo, useCallback, FC } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle, CreditCard, Loader2, Wrench, Package, AlertTriangle } from 'lucide-react';
import { JwtPayload } from "@/app/_shared/lib/jwt";
import { useCustomerInfo } from '../hooks/useCustomerInfo';
import { useCustomerJobs } from '../hooks/useCustomerJobs';
import { useCustomerChangePassword } from '../hooks/useCustomerChangePassword';
import { useCancelJob } from '../hooks/useCancelJob';
import PasswordStrengthIndicator from '@/app/_shared/components/PasswordStrengthIndicator';
import { useCart } from '../hooks/useCart';
import AddressEditModal from '../modals/AddressEditModal';
import EmailEditModal from '../modals/EmailEditModal';
import CheckoutModal from '../modals/CheckoutModal';
import JobDetailsModal from '../modals/JobDetailsModal';


interface CustomerDashboardClientProps {
  user: JwtPayload;
}
type Tab = 'bookings' | 'availed-jobs' | 'profile';
// Define the type for customer data, similar to SettingsPage
type CustomerData = {
  customer_id: number;
  user_id: string; // Should be string for UUID
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  company_name: string;
  contact: string;
  address: {
    address_id: number;
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    postal_code: string;
  };
};

export default function CustomerDashboardClient({ user }: CustomerDashboardClientProps) {
  const { customerInfo, loading, error, refreshCustomerInfo } = useCustomerInfo() as { customerInfo: any, loading: boolean, error: string | null, refreshCustomerInfo: () => void };
  const { cartItems, loading: cartLoading, error: cartError, removeItem, clearCart } = useCart();
  const { jobs: availedJobs, refreshJobs } = useCustomerJobs(customerInfo?.customer_id);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('availed-jobs');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const handleAddressUpdateSuccess = useCallback(() => {
    refreshCustomerInfo();
  }, [refreshCustomerInfo]);

  const totalPendingPayment = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((total, item) => {
      // Ensure base_price is treated as a number
      const price = parseFloat(item.service?.base_price ?? '0') || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  const stats = useMemo(() => {
    if (!availedJobs) {
      return {
        activeBookings: 0,
        completedServices: 0,
        nextServiceDate: 'N/A',
      };
    }

    const activeBookings = availedJobs.filter(job =>
      !['completed', 'claimed', 'cancelled'].includes(job.status.toLowerCase())
    ).length;

    const completedServices = availedJobs.filter(job =>
      ['completed', 'claimed'].includes(job.status.toLowerCase())
    ).length;

    const nextService = availedJobs
      .filter(job => job.scheduled_date && new Date(job.scheduled_date) >= new Date() && !['completed', 'claimed', 'cancelled'].includes(job.status.toLowerCase()))
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())[0];

    const nextServiceDate = nextService ? new Date(nextService.scheduled_date).toLocaleDateString() : 'N/A';

    return { activeBookings, completedServices, nextServiceDate };
  }, [availedJobs]);

  const customer = customerInfo;
  if (loading) {
    return <div className="flex flex-col h-screen bg-gray-50 items-center justify-center text-gray-700">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex flex-col h-screen bg-gray-50 items-center justify-center text-red-600">Error: {error}</div>;
  }

  const ProfileView: React.FC<{ customer: CustomerData | null }> = ({ customer }) => {
    const formatAddress = (address: any) => {
      if (!address) return null;
      const { house_number, street, barangay, city, province, postal_code, region } = address;
      return [house_number, street, barangay, city, province, postal_code, region].filter(Boolean).join(', ');
    };
  
    const serviceAddress = customer?.address ? formatAddress(customer.address) : '';
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Address Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Email Address</h2>
              <button 
                onClick={() => setIsEmailModalOpen(true)}
                className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                EDIT
              </button>
            </div>
            <p className="text-sm text-gray-800 font-medium mb-2">{customer?.email || 'N/A'}</p>
            {customer?.is_verified && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Verified
              </span>
            )}
          </div>

          {/* Mobile Number Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mobile Number</h2>
            </div>
            <p className="text-lg text-gray-800 font-bold mb-2">{customer?.contact || 'N/A'}</p>
            
          </div>
        </div>

        {/* Address Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
            <button 
              onClick={() => setIsAddressModalOpen(true)}
              className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              EDIT
            </button>
          </div>
  
          <div>
            <label className="text-sm text-gray-500 block mb-3">Service Address</label>
            {serviceAddress ? (
              <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-800">{serviceAddress}</p>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="px-4 py-3 border-2 border-dashed border-blue-300 text-blue-500 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                ADD YOUR ADDRESS
              </button>
            )}
          </div>
        </div>
        <ChangePasswordView userId={customer?.user_id} />
      </div>
    );
  };

  const ChangePasswordView: React.FC<{ userId: string | undefined }> = ({ userId }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { changePassword, isSubmitting, error, success, setError, setSuccess } = useCustomerChangePassword();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!userId) {
        setError("User ID is missing. Cannot change password.");
        return;
      }

      const wasSuccessful = await changePassword({
        userId,
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (wasSuccessful) {
        // Clear fields on success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
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
            <PasswordStrengthIndicator
              password={newPassword}
              onPasswordChange={setNewPassword}
              label="New Password"
              userType="customer"
              required
            />
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

  interface AvailedJobsViewProps {
    customerId: number | undefined;
    onDetailsClick: (job: any) => void;
  }
  const AvailedJobsView: FC<AvailedJobsViewProps> = ({ customerId, onDetailsClick }) => {
    const { jobs, loading, error, refreshJobs } = useCustomerJobs(customerId);
    const { cancelJob, isCancelling } = useCancelJob();
    const [cancellingJobId, setCancellingJobId] = useState<number | null>(null);

    const RefundConfirmation: React.FC<{ closeToast?: () => void; onConfirm: () => void }> = ({ closeToast, onConfirm }) => (
      <div className="p-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-800">Are you sure?</h3>
            <h5 className="text-sm text-gray-600 mt-1">
              Do you want to cancel this job and request a refund? The Refund will be deducted 50 pesos for the payment transaction
            </h5>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeToast} className="px-4 py-1.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={() => { onConfirm(); if (closeToast) closeToast(); }} className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700">Proceed</button>
        </div>
      </div>
    );

    const handleRefund = (jobId: number) => {
      const confirmRefund = async () => {
        setCancellingJobId(jobId);
        await cancelJob(jobId);
        setCancellingJobId(null);
        refreshJobs();
      };

      toast(<RefundConfirmation onConfirm={confirmRefund} />, { autoClose: false, closeOnClick: false });
    };
    if (loading) {
      return (
        <div className="flex justify-center items-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="animate-spin text-gray-400" size={24} />
          <p className="ml-3 text-gray-500">Loading availed jobs...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 bg-red-50 p-10 rounded-2xl border border-red-200">
          <p>Error loading jobs: {error}</p>
        </div>
      );
    }

    const getStatusChip = (status: string) => {
      const baseClasses = "inline-block px-3 py-1 text-xs font-medium rounded-full";
      switch (status.toLowerCase()) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-700`;
        case 'confirmed': return `${baseClasses} bg-blue-100 text-blue-700`;
        case 'in-progress': return `${baseClasses} bg-purple-100 text-purple-700`;
        case 'completed': return `${baseClasses} bg-green-100 text-green-700`;
        case 'claimed': return `${baseClasses} bg-green-200 text-green-800`;
        case 'available_for_claim': return `${baseClasses} bg-cyan-100 text-cyan-700`;
        case 'cancelled': return `${baseClasses} bg-red-100 text-red-700`;
        default: return `${baseClasses} bg-gray-100 text-gray-700`;
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Availed Jobs</h2>
        {jobs && jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Wrench size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{job.service?.name || `Job ID: ${job.id}`}</h3>
                      <p className="text-sm text-gray-500">Scheduled: {new Date(job.scheduled_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className={getStatusChip(job.status)}>{job.status}</span>
                    {job.technician && (
                      <p>Technician: <span className="font-medium text-gray-800">{job.technician.user.name}</span></p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {job.status.toLowerCase() === 'claimed' && (
                    <button
                      onClick={() => onDetailsClick(job)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Details
                    </button>
                  )}
                  {job.status.toLowerCase() === 'available_for_claim' && (
                    <button
                      onClick={() => handleRefund(job.id)}
                      disabled={isCancelling && cancellingJobId === job.id}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 flex items-center gap-2"
                    >
                      {(isCancelling && cancellingJobId === job.id) && <Loader2 size={16} className="animate-spin" />}
                      Refund
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Availed Jobs Yet</h3>
            <p className="text-sm">You haven't availed any services. Book one to see it here.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ToastContainer position="top-center" theme="colored" />
      <AddressEditModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        customer={customer}
        onUpdateSuccess={handleAddressUpdateSuccess}
      />
      <EmailEditModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        customer={customer}
      />
      <JobDetailsModal
        isOpen={isJobDetailsModalOpen}
        onClose={() => setIsJobDetailsModalOpen(false)}
        job={selectedJob}
        onJobCompleted={refreshJobs}
      />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        customer={customer}
        totalAmount={totalPendingPayment}
      />
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your HVAC service bookings and view service history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.activeBookings}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Services</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.completedServices}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                <h3 className="text-3xl font-bold text-gray-900">₱{totalPendingPayment.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <CreditCard className="text-orange-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Service</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.nextServiceDate}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Clock className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-full shadow-sm mb-6 p-2 flex gap-2">
          {[
            { id: 'bookings', label: 'My Bookings' },
            { id: 'availed-jobs', label: 'Availed Jobs' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <CartView cartItems={cartItems} loading={cartLoading} error={cartError} removeItem={removeItem} clearCart={clearCart} onCheckout={() => setIsCheckoutModalOpen(true)} />
        )}

        {activeTab === 'availed-jobs' && (
          <AvailedJobsView 
            customerId={customer?.customer_id} 
            onDetailsClick={(job) => {
              setSelectedJob(job);
              setIsJobDetailsModalOpen(true);
            }}/>
        )}

        {activeTab === 'profile' && <ProfileView customer={customer} />}
      </div>
    </div>
  );
}

interface CartViewProps {
  cartItems: any[];
  loading: boolean;
  error: string | null;
  removeItem: (itemId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, loading, error, removeItem, clearCart, onCheckout }) => {
  const router = useRouter();
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleDelete = async (itemId: number) => {
    setDeletingItemId(itemId);
    await removeItem(itemId);
    setDeletingItemId(null);
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
  };
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Cart</h2>
        <button
          onClick={() => router.push('/booking')}
          className="px-6 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors ml-auto"
        >
          Book New Service
        </button>
        {!loading && cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors disabled:bg-red-50 flex items-center ml-2"
          >
            {isClearing && <Loader2 size={16} className="animate-spin mr-2" />}
            Clear Cart
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="animate-spin text-gray-400" size={24} />
          <p className="ml-3 text-gray-500">Loading cart...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 bg-red-50 p-10 rounded-2xl border border-red-200">
          <p>Error loading cart: {error}</p>
        </div>
      )}

      {!loading && !error && (
        cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.service?.name || `Service ID: ${item.service_id}`}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ₱{parseFloat(item.service?.base_price || '0').toFixed(2)}</p>
                  {item.notes && <p className="text-xs text-gray-500 italic mt-1">Notes: &quot;{item.notes}&quot;</p>}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingItemId === item.id}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 flex items-center"
                  >
                    {deletingItemId === item.id && <Loader2 size={16} className="animate-spin mr-2" />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 text-center text-gray-500 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <p>Your cart is empty.</p>
          </div>
        )
      )}
      {!loading && !error && cartItems.length > 0 && (
        <div className="flex justify-end mt-6">
            <button 
                onClick={onCheckout}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};