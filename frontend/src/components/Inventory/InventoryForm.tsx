import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InventoryItem } from '../../types';

interface InventoryFormProps {
  show: boolean;
  onHide: () => void;
  item?: InventoryItem | null;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ show, onHide, item }) => {
  const { addItem, updateItem, categories, brands } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', sku: '', quantity: 0, price: 0, description: '', categoryId: '', brandId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name, sku: item.sku, quantity: item.quantity, price: item.price,
        description: item.description, categoryId: item.category?.id || '', brandId: item.brand?.id || ''
      });
    } else {
      setFormData({ name: '', sku: '', quantity: 0, price: 0, description: '', categoryId: '', brandId: '' });
    }
    setErrors({});
  }, [item, show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity must be non-negative';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.brandId) newErrors.brandId = 'Brand is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const category = categories.find(c => c.id === formData.categoryId)!;
    const brand = brands.find(b => b.id === formData.brandId)!;
    const getStatus = (quantity: number) => quantity === 0 ? 'out-of-stock' : quantity <= 5 ? 'low-stock' : 'in-stock';

    if (item) {
      updateItem(item.id, {
        name: formData.name, sku: formData.sku, quantity: formData.quantity, price: formData.price,
        description: formData.description, category, brand, status: getStatus(formData.quantity)
      });
    } else {
      addItem({
        name: formData.name, sku: formData.sku, quantity: formData.quantity, price: formData.price,
        description: formData.description, category, brand, status: getStatus(formData.quantity),
        createdBy: user?.id || '1'
      });
    }
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (!show) return null;

  return (
    <div className="modal-base">
      <div className="modal-content p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item ? 'Edit Item' : 'Add New Item'}</h3>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                     className={`input-base ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter item name" />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SKU *</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange}
                     className={`input-base ${errors.sku ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter SKU" />
              {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                      className={`input-base ${errors.categoryId ? 'border-red-500 focus:ring-red-500' : ''}`}>
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand *</label>
              <select name="brandId" value={formData.brandId} onChange={handleChange}
                      className={`input-base ${errors.brandId ? 'border-red-500 focus:ring-red-500' : ''}`}>
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brandId && <p className="text-sm text-red-600 mt-1">{errors.brandId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                     className={`input-base ${errors.quantity ? 'border-red-500 focus:ring-red-500' : ''}`} min={0} />
              {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange}
                     className={`input-base ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`} min={0} step="0.01" />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange}
                      className="input-base" placeholder="Enter item description" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onHide} className="btn-outlined">Cancel</button>
            <button type="submit" className="btn-primary">{item ? 'Update Item' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
