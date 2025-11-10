"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Edit, Trash2, X, Search } from 'lucide-react';
import { useUsers } from './Hooks/useUsers';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';

const EditUserModal = ({ isOpen, onClose, user, onUpdateSuccess }: { isOpen: boolean, onClose: () => void, user: any | null, onUpdateSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    new_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        new_password: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: any = {};
    if (formData.name !== user.name) payload.name = formData.name;
    if (formData.email !== user.email) payload.email = formData.email;
    if (formData.role !== user.role) payload.role = formData.role;
    if (formData.new_password) payload.new_password = formData.new_password;

    if (Object.keys(payload).length === 0) {
      alert('No changes detected.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await http.put(`/admin/users/${user.id}`, payload);
      alert('User updated successfully!');
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(axiosUtils.getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Edit User: {user?.name}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
          <input name="new_password" type="password" value={formData.new_password} onChange={handleChange} placeholder="New Password (optional)" className="w-full p-2 border rounded" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">
              {isSubmitting && <Loader2 className="animate-spin mr-2" />}
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilesManagementInternal: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsers();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: 'customer' | 'technician' | 'admin') => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'technician':
        return 'bg-blue-100 text-blue-700';
      case 'customer':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action might be irreversible.')) {
      try {
        await http.delete(`/admin/users/${userId}`);
        alert('User deleted successfully.');
        fetchUsers();
      } catch (err) {
        alert(`Failed to delete user: ${axiosUtils.getErrorMessage(err)}`);
      }
    }
  };

  const handleUpdateSuccess = () => {
    fetchUsers();
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-gray-50">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-26rem)]">
        <div className="overflow-y-auto flex-1">
          <table className="w-full responsive-table">
            <thead className="bg-gray-50 border-b border-gray-100 hidden lg:table-header-group">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 lg:divide-y-0">
              {loading ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={5}>
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-red-500" colSpan={5}>
                    {error}
                  </td>
                </tr>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                <tr key={user.id} className="block lg:table-row mb-4 lg:mb-0 border lg:border-0 rounded-lg lg:rounded-none hover:bg-gray-50 transition-colors">
                  <td className="p-4 block lg:table-cell" data-label="Name">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.id}</p>
                    </div>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Email">
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Role">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Status">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 block lg:table-cell" data-label="Actions">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(user)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit size={18} className="text-gray-600" /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete"><Trash2 size={18} className="text-gray-600" /></button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr className="block lg:table-row">
                  <td className="p-4 lg:p-6 text-center text-gray-500" colSpan={5}>
                    {searchTerm ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ProfilesManagementInternal;
