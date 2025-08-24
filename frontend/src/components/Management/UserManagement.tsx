import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'staff' as 'admin' | 'staff', isActive: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, isActive: user.isActive });
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    if (currentUser?.id === id) { alert('You cannot delete your own account'); return; }
    if (window.confirm('Are you sure you want to delete this user?')) deleteUser(id);
  };
  const handleCloseForm = () => { setShowForm(false); setEditingUser(null); setFormData({ name: '', email: '', role: 'staff', isActive: true }); setErrors({}); };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingUser) updateUser(editingUser.id, formData); else addUser(formData);
    handleCloseForm();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const roleBadge = (role: string) => (
    <span className={`badge-status ${role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200'}`}>{role}</span>
  );
  const statusBadge = (isActive: boolean) => (
    <span className={`badge-status ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{isActive ? 'Active' : 'Inactive'}</span>
  );

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage system users and their roles</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <FiPlus className="w-5 h-5 mr-2" /> Add User
          </button>
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="sticky top-0 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="table-header px-6 py-4 text-left">User</th>
                  <th className="table-header px-6 py-4 text-left">Email</th>
                  <th className="table-header px-6 py-4 text-left">Role</th>
                  <th className="table-header px-6 py-4 text-left">Status</th>
                  <th className="table-header px-6 py-4 text-left">Created Date</th>
                  <th className="table-header px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={`table-row ${index % 2 === 0 ? 'table-row-striped' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">{statusBadge(user.isActive)}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{user.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(user)} className="btn-outlined text-blue-600 dark:text-blue-400">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-outlined text-red-600 dark:text-red-400 disabled:opacity-50"
                          disabled={currentUser?.id === user.id}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="modal-base">
            <div className="modal-content p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-base w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-base w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role *</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="input-base w-full">
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">Active User</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={handleCloseForm} className="btn-outlined">Cancel</button>
                  <button type="submit" className="btn-primary">{editingUser ? 'Update User' : 'Add User'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
