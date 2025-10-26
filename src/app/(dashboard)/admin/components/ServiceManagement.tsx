"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Search, Trash2, Loader2, X } from 'lucide-react';
import { useServiceCategories, ServiceCategory, AddCategoryData, UpdateCategoryData, Service, AddServiceData, UpdateServiceData } from './Hooks/useServiceCategories';

// Re-usable Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-3">
          {footer}
        </div>
      </div>
    </div>
  );
};


// Add/Edit Category Modal
interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  category?: ServiceCategory | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, category }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(category ? category.name : '');
      setDescription(category ? category.description || '' : '');
    } else {
      setName('');
      setDescription('');
    }
  }, [isOpen, category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Category name is required.');
      return;
    }
    onSubmit(category ? { id: category.id, data: { name, description } } : { name, description });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <><Loader2 size={18} className="animate-spin" /><span>{category ? 'Updating...' : 'Adding...'}</span></> : (category ? 'Update Category' : 'Add Category')}
          </button>
        </>
      }
    >
      <div>
        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
        <input id="category-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="category-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </Modal>
  );
};

// Add/Edit Service Modal
interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  service?: Service | null;
  categories: ServiceCategory[];
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, service, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(service ? service.name : '');
      setDescription(service ? service.description || '' : '');
      setCategoryId(service ? service.category_id : '');
      setPrice(service && service.base_price ? service.base_price : '');
    } else {
      setName('');
      setDescription('');
      setCategoryId('');
      setPrice('');
    }
  }, [isOpen, service]);

  const handleSubmit = () => {
    if (!name.trim() || !categoryId || !price.trim()) {
      alert('Please fill all required fields: Name, Category, and Price.');
      return;
    }
    const serviceData = {
      name,
      description,
      category_id: Number(categoryId),
      base_price: price, // Send price as a string under base_price
    };
    onSubmit(service ? { id: service.id, data: serviceData } : serviceData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Edit Service' : 'Add New Service'}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <><Loader2 size={18} className="animate-spin" /><span>{service ? 'Updating...' : 'Adding...'}</span></> : (service ? 'Update Service' : 'Add Service')}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
          <input id="service-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select id="service-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Select a category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="service-price" className="block text-sm font-medium text-gray-700 mb-1">Price (PHP) <span className="text-red-500">*</span></label>
          <input id="service-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="service-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="service-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </Modal>
  );
};

const ServiceManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    categories, loading: categoriesLoading, error: categoriesError, addCategory, updateCategory, deleteCategory,
    services, servicesLoading, servicesError, addService, updateService, deleteService
  } = useServiceCategories();

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const filteredServices = services.filter(service => {
    const categoryName = categoryMap.get(service.category_id) || '';
    const searchTerm = searchQuery.toLowerCase();
    return service.name.toLowerCase().includes(searchTerm) ||
           categoryName.toLowerCase().includes(searchTerm) ||
           String(service.id).toLowerCase().includes(searchTerm);
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCategorySubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (data.id) {
        await updateCategory(data.id, data.data);
      } else {
        await addCategory(data);
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      alert(`Error: Could not save the category.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (data.id) {
        await updateService(data.id, data.data);
      } else {
        await addService(data);
      }
      setServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      alert(`Error: Could not save the service.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        alert('Error: Could not delete the category.');
      }
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
      } catch (error) {
        alert('Error: Could not delete the service.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Service & Category Management</h1>
      
      {/* Combined Search and Add Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search services or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => { setEditingCategory(null); setCategoryModalOpen(true); }} className="w-full md:w-auto justify-center px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Category
          </button>
          <button onClick={() => { setEditingService(null); setServiceModalOpen(true); }} className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Service
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Categories Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100">Service Categories</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoriesLoading ? (
                  <tr><td colSpan={2} className="p-6 text-center"><Loader2 className="animate-spin inline-block" /></td></tr>
                ) : categoriesError ? (
                  <tr><td colSpan={2} className="p-6 text-center text-red-500">{categoriesError}</td></tr>
                ) : filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-sm text-gray-500">{cat.description || 'No description'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingCategory(cat); setCategoryModalOpen(true); }} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100">Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {servicesLoading ? (
                  <tr><td colSpan={4} className="p-6 text-center"><Loader2 className="animate-spin inline-block" /></td></tr>
                ) : servicesError ? (
                  <tr><td colSpan={4} className="p-6 text-center text-red-500">{servicesError}</td></tr>
                ) : filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{srv.name}</p>
                      <p className="text-sm text-gray-500">{categoryMap.get(srv.category_id) || 'Uncategorized'}</p>
                    </td>
                    <td className="p-4 font-medium">₱{srv.base_price ? parseFloat(srv.base_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingService(srv); setServiceModalOpen(true); }} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteService(srv.id)} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} onSubmit={handleCategorySubmit} isLoading={isSubmitting} category={editingCategory} />
      <ServiceFormModal isOpen={isServiceModalOpen} onClose={() => setServiceModalOpen(false)} onSubmit={handleServiceSubmit} isLoading={isSubmitting} service={editingService} categories={categories} />
    </div>
  );
};

export default ServiceManagement;