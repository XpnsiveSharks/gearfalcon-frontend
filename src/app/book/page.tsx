"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useAuth } from "@/app/_shared/hooks/useAuth";
import { http } from "@/app/_shared/services/axiosClient";
import { useServices } from "@/app/_shared/hooks/useServices";
import { Loader2, X, ShoppingCart } from "lucide-react";

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

function BookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceCategoryName = searchParams?.get("service");

  const { user, isAuthenticated } = useAuth();
  const { services, categories, loading, error } = useServices();

  const currentCategory = useMemo(() => {
    if (!serviceCategoryName || categories.length === 0) return null;
    return categories.find(c => c.name.toUpperCase() === serviceCategoryName.toUpperCase());
  }, [serviceCategoryName, categories]);

  // Group services by their category name
  const servicesByCategory = useMemo(() => {
    const categoryMap = new Map(categories.map(c => [c.id, c.name.toUpperCase()]));
    return services.reduce((acc, service) => {
      const categoryName = categoryMap.get(service.category_id);
      if (categoryName) {
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(service);
      }
      return acc;
    }, {} as Record<string, typeof services>);
  }, [services, categories]);

  // Get list of sub-services based on selected main service
  const subServices = useMemo(() => {
    if (!serviceCategoryName) return [];
    return servicesByCategory[serviceCategoryName.toUpperCase()] || [];
  }, [serviceCategoryName, servicesByCategory]);

  const [selectedSubService, setSelectedSubService] = useState("");
  const [subServiceDetails, setSubServiceDetails] = useState<{ description: string | null; base_price: string | null; } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubService) {
      const details = subServices.find(s => s.name === selectedSubService);
      setSubServiceDetails(
        details
          ? { description: details.description || null, base_price: details.base_price}
          : null
      );
    } else {
      setSubServiceDetails(null);
    }
  }, [selectedSubService, subServices]);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubService) {
      alert("Please select a service before proceeding.");
      return;
    }

    const selectedServiceDetails = subServices.find(s => s.name === selectedSubService);

    if (!currentCategory || !selectedServiceDetails) {
      alert("An error occurred. Please select the service again.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const selectedServiceDetails = subServices.find(s => s.name === selectedSubService);
    if (!selectedServiceDetails) {
      setModalError("Selected service details not found. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const cartItemData = {
      service_id: selectedServiceDetails.id,
      quantity: quantity,
      notes: notes,
    };

    if (isAuthenticated) {
      try {
        await http.post('/customers/cart/items', cartItemData);
        alert('Service added to your cart!');
        router.push('/customer'); // Redirect to customer dashboard or cart page
      } catch (err) {
        console.error("Error adding to cart:", err);
        setModalError("Failed to add item to cart. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // User is not logged in, save to localStorage and redirect to login
      localStorage.setItem('pendingCartItem', JSON.stringify(cartItemData));
      router.push('/login');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Book a Service</h1>      
      
      {currentCategory && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h2 className="font-semibold text-slate-800">You’re booking: {currentCategory.name}</h2>
          <p className="text-sm text-slate-600 mt-1">{currentCategory.description}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin text-slate-400" size={32} />
          <p className="ml-4 text-slate-500">Loading services...</p>
        </div>
      )}

      {error && !loading && <p className="text-red-500">{error}</p>}

      {!serviceCategoryName && !loading && (
        <p className="text-slate-500">
          Please go back and choose a service category first.
        </p>
      )}

      {serviceCategoryName && !loading && !error && (
        <form onSubmit={handleOpenModal} className="space-y-4">
          {isAuthenticated && user ? (
            <div className="bg-slate-50 border rounded-lg p-4 space-y-1">
              <p className="text-slate-700 text-sm">
                Booking as: <strong>{user.name}</strong>
              </p>
              <p className="text-slate-700 text-sm">{user.email}</p>
            </div>
          ) : null}

          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedSubService}
            onChange={(e) => setSelectedSubService(e.target.value)}
            required
          >
            <option value="">Select a sub-service</option>
            {subServices.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {subServiceDetails && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 transition-all duration-300">
              {subServiceDetails.description && (
                <p className="text-sm text-slate-600">{subServiceDetails.description}</p>
              )}
              {subServiceDetails.base_price && (
                <p className="text-lg font-semibold text-slate-800">
                  Price: ₱{parseFloat(subServiceDetails.base_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          )}


          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedSubService}
          >
            Next
          </button>

        </form>
      )}

      {/* Modal is now outside the form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Cart">
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Any special requests or details..."
            />
          </div>

          {modalError && (
            <p className="text-sm text-red-600">{modalError}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              Confirm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto py-20">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin text-slate-400" size={32} />
          <p className="ml-4 text-slate-500">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookForm />
    </Suspense>
  );
}
