import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiFilter, FiPackage, FiArrowUp, FiArrowDown, FiChevronDown } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InventoryItem } from '../../types';
import InventoryForm from './InventoryForm';

const InventoryTable: React.FC = () => {
  const { items, deleteItem, categories, brands } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || item.category?.id === filterCategory;
      const matchesBrand = !filterBrand || item.brand?.id === filterBrand;
      const matchesStatus = !filterStatus || item.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [items, searchTerm, filterCategory, filterBrand, filterStatus, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in-stock': { class: 'badge-delivered', label: 'In Stock' },
      'low-stock': { class: 'badge-pending', label: 'Low Stock' },
      'out-of-stock': { class: 'badge-cancelled', label: 'Out of Stock' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge-status ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSort = (field: 'name' | 'quantity' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterBrand('');
    setFilterStatus('');
  };

  const activeFilters = [filterCategory, filterBrand, filterStatus].filter(Boolean).length;

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your inventory items efficiently
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center justify-center"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card-base p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base pl-12 pr-4 py-3 w-full"
                />
              </div>
            </div>

            {/* Filter toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-outlined flex items-center ${activeFilters > 0 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filters
                {activeFilters > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    {activeFilters}
                  </span>
                )}
                <FiChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as 'name' | 'quantity' | 'price');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="input-base w-full"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="quantity-asc">Quantity (Low to High)</option>
                  <option value="quantity-desc">Quantity (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="sticky top-0 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th 
                    className="table-header px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Item</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="table-header px-6 py-4 text-left">SKU</th>
                  <th className="table-header px-6 py-4 text-left">Category</th>
                  <th className="table-header px-6 py-4 text-left">Brand</th>
                  <th 
                    className="table-header px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Quantity</span>
                      {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th 
                    className="table-header px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Price</span>
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="table-header px-6 py-4 text-left">Status</th>
                  <th className="table-header px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`table-row ${index % 2 === 0 ? 'table-row-striped' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {item.sku}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {item.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {item.brand?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        item.quantity <= 5 
                          ? 'text-red-600 dark:text-red-400' 
                          : item.quantity <= 20 
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          title="Edit item"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          title="Delete item"
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
          
          {/* Empty state */}
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="btn-outlined"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {filteredAndSortedItems.length} of {items.length} items
          </span>
          <span>
            {activeFilters > 0 && `${activeFilters} filter${activeFilters > 1 ? 's' : ''} applied`}
          </span>
        </div>
      </div>

      <InventoryForm
        show={showForm}
        onHide={handleCloseForm}
        item={editingItem}
      />
    </div>
  );
};

export default InventoryTable;
