import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { Category } from '../../types';

const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all inventory items in this category.')) {
      try {
        const result = await deleteCategory(id);
        alert(result.message || 'Category deleted successfully');
      } catch (error: any) {
        alert(error.message || 'Failed to delete category');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingCategory) updateCategory(editingCategory.id, formData);
    else addCategory(formData);
    handleCloseForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Category Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage product categories</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <FiPlus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="sticky top-0 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="table-header px-6 py-4 text-left">Name</th>
                  <th className="table-header px-6 py-4 text-left">Description</th>
                  <th className="table-header px-6 py-4 text-left">Created Date</th>
                  <th className="table-header px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id} className={`table-row ${index % 2 === 0 ? 'table-row-striped' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiTag className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{category.description}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{category.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(category)} className="btn-outlined text-blue-600 dark:text-blue-400">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="btn-outlined text-red-600 dark:text-red-400">
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-base w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter category name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-base w-full"
                    placeholder="Enter category description"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={handleCloseForm} className="btn-outlined">Cancel</button>
                  <button type="submit" className="btn-primary">{editingCategory ? 'Update Category' : 'Add Category'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
