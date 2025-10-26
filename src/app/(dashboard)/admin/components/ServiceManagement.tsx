"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Search, Trash2, Loader2, X } from 'lucide-react';
import { useServiceCategories, ServiceCategory, AddCategoryData, UpdateCategoryData } from './Hooks/useServiceCategories';

interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (categoryData: AddCategoryData) => Promise<void>;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Category name is required.');
      return;
    }
    await onAdd({ name, description });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Add New Category</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              'Add Category'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, categoryData: UpdateCategoryData) => Promise<void>;
  isLoading: boolean;
  category: ServiceCategory | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onUpdate, isLoading, category }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    }
  }, [category]);

  if (!isOpen || !category) {
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Category name is required.');
      return;
    }
    await onUpdate(category.id, { name, description });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Category</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-category-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <><Loader2 size={18} className="animate-spin" /><span>Updating...</span></> : 'Update Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceManagement: React.FC = () => {
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, loading: categoriesLoading, error: categoriesError, addCategory, updateCategory, deleteCategory } = useServiceCategories();

  const services: Service[] = [
    { id: 'SRV-001', category_id: 'CAT-02', name: 'Aircon Cleaning', description: 'Comprehensive cleaning of air conditioning units.', base_price: 1500 },
    { id: 'SRV-002', category_id: 'CAT-02', name: 'Refrigerator Repair', description: 'Repair of refrigerator cooling systems.', base_price: 2500 },
    { id: 'SRV-003', category_id: 'CAT-01', name: 'Washing Machine Installation', description: 'Installation and setup of new washing machines.', base_price: 1000 },
    { id: 'SRV-004', category_id: 'CAT-01', name: 'TV Mounting', description: null, base_price: 1200 },
    { id: 'SRV-005', category_id: 'CAT-03', name: 'General Electrical Checkup', description: 'A general checkup of electrical wiring and components.', base_price: 800 },
  ];

  const categoryMap = new Map([['CAT-01', 'Installation'], ['CAT-02', 'Repairs'], ['CAT-03', 'Others']]);

  const filteredServices = services.filter(service => {
    const categoryName = categoryMap.get(service.category_id) || '';
    return service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    categoryName.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.id.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(categorySearchQuery.toLowerCase()))
  );

  const handleAddCategory = async (data: AddCategoryData) => {
    setIsSubmitting(true);
    try {
      await addCategory(data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Error: Could not add the category. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (id: number, data: UpdateCategoryData) => {
    setIsSubmitting(true);
    try {
      await updateCategory(id, data);
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Error: Could not update the category. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
        // The hook handles state update, so no need to do anything here on success.
      } catch (error) {
        console.error(`Failed to delete category ${id}:`, error);
        alert('Error: Could not delete the category. Please check the console for details.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Services</h1>
      </div>

      {/* Service Categories Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Service Categories</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category Name</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categoriesLoading ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categoriesError ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-red-500">{categoriesError}</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">ID: {category.id}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{category.description || <span className="text-gray-400">N/A</span>}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenEditModal(category)} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={3}>No categories match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
        isLoading={isSubmitting}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateCategory}
        isLoading={isSubmitting}
        category={editingCategory}
      />

      {/* Service Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Service List</h2>
          <button className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Service
          </button>
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services by name, category, or ID..."
              value={serviceSearchQuery}
              onChange={(e) => setServiceSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service Name</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Base Price</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">{categoryMap.get(service.category_id) || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {service.description || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-gray-900">₱{service.base_price.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={5}>No services found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;