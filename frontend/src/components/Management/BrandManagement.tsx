import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { Brand } from '../../types';

const BrandManagement: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo: brand.logo || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand? This will also delete all inventory items using this brand.')) {
      try {
        const result = await deleteBrand(id);
        alert(result.message || 'Brand deleted successfully');
      } catch (error: any) {
        alert(error.message || 'Failed to delete brand');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBrand(null);
    setFormData({ name: '', logo: '' });
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
    if (editingBrand) updateBrand(editingBrand.id, formData);
    else addBrand(formData);
    handleCloseForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Brand Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage product brands</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <FiPlus className="w-5 h-5 mr-2" />
            Add Brand
          </button>
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="sticky top-0 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="table-header px-6 py-4 text-left">Name</th>
                  <th className="table-header px-6 py-4 text-left">Logo</th>
                  <th className="table-header px-6 py-4 text-left">Created Date</th>
                  <th className="table-header px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, index) => (
                  <tr key={brand.id} className={`table-row ${index % 2 === 0 ? 'table-row-striped' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiTag className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded" />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No logo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{brand.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(brand)} className="btn-outlined text-blue-600 dark:text-blue-400">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(brand.id)} className="btn-outlined text-red-600 dark:text-red-400">
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
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h3>
                <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-base w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter brand name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    className="input-base w-full"
                    placeholder="Enter logo URL"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={handleCloseForm} className="btn-outlined">Cancel</button>
                  <button type="submit" className="btn-primary">{editingBrand ? 'Update Brand' : 'Add Brand'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;
