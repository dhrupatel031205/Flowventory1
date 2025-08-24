import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, Category, Brand, InventoryLog, User } from '../types';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client';

interface DataContextType {
  items: InventoryItem[];
  categories: Category[];
  brands: Brand[];
  logs: InventoryLog[];
  users: User[];
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<any>;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => Promise<void>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<any>;
  addUser: (user: Omit<User, 'id' | 'createdAt'> & { password?: string }) => Promise<void>;
  updateUser: (id: string, user: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const [cats, brs, its, lgs] = await Promise.all([
          apiGet<Category[]>('/api/categories'),
          apiGet<Brand[]>('/api/brands'),
          apiGet<any[]>('/api/items'),
          apiGet<InventoryLog[]>('/api/logs'),
        ]);
        const normalizeDates = <T extends { createdAt?: any; updatedAt?: any }>(arr: T[]) => arr.map((x) => ({
          ...x,
          ...(x.createdAt ? { createdAt: new Date(x.createdAt) } : {}),
          ...(x.updatedAt ? { updatedAt: new Date(x.updatedAt) } : {}),
        }));
        setCategories(normalizeDates(cats) as Category[]);
        setBrands(normalizeDates(brs) as Brand[]);
        setItems(
          its.map((i) => ({
            ...i,
            createdAt: new Date(i.createdAt),
            updatedAt: new Date(i.updatedAt),
            // API returns populated refs; keep shape {id,name,...}
            category: i.category ? { ...i.category, createdAt: new Date(i.category.createdAt) } : null,
            brand: i.brand ? { ...i.brand, createdAt: new Date(i.brand.createdAt) } : null,
          }))
        );
        setLogs(lgs.map((l) => ({ ...l, timestamp: new Date(l.timestamp) })));
      } catch (e) {
        console.error('Failed initial load', e);
      }
      // Try to load users (admin-only). Ignore errors when not authorized.
      try {
        const usrs = await apiGet<User[]>('/api/users');
        setUsers(usrs.map((u) => ({ ...u, createdAt: new Date(u.createdAt) })));
      } catch {}
    })();
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const payload = {
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      description: item.description,
      status: item.status,
      category: item.category?.id,
      brand: item.brand?.id,
      createdBy: item.createdBy,
    };
    const created = await apiPost<any>('/api/items', payload);
    const normalized: InventoryItem = {
      ...created,
      createdAt: new Date(created.createdAt),
      updatedAt: new Date(created.updatedAt),
      category: created.category ? { ...created.category, createdAt: new Date(created.category.createdAt) } : null,
      brand: created.brand ? { ...created.brand, createdAt: new Date(created.brand.createdAt) } : null,
    };
    setItems((prev) => [...prev, normalized]);
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const payload: any = { ...updates };
    if (updates.category) payload.category = updates.category.id;
    if (updates.brand) payload.brand = updates.brand.id;
    const updated = await apiPatch<any>(`/api/items/${id}`, payload);
    const normalized: InventoryItem = {
      ...updated,
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt),
      category: updated.category ? { ...updated.category, createdAt: new Date(updated.category.createdAt) } : null,
      brand: updated.brand ? { ...updated.brand, createdAt: new Date(updated.brand.createdAt) } : null,
    };
    setItems((prev) => prev.map((it) => (it.id === id ? normalized : it)));
  };

  const deleteItem = async (id: string) => {
    await apiDelete(`/api/items/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    const created = await apiPost<Category>('/api/categories', category);
    setCategories((prev) => [...prev, { ...created, createdAt: new Date(created.createdAt) }]);
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    const updated = await apiPatch<Category>(`/api/categories/${id}`, category);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...updated, createdAt: new Date(updated.createdAt) } : c)));
  };

  const deleteCategory = async (id: string) => {
    const response = await apiDelete(`/api/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return response;
  };

  const addBrand = async (brand: Omit<Brand, 'id' | 'createdAt'>) => {
    const created = await apiPost<Brand>('/api/brands', brand);
    setBrands((prev) => [...prev, { ...created, createdAt: new Date(created.createdAt) }]);
  };

  const updateBrand = async (id: string, brand: Partial<Brand>) => {
    const updated = await apiPatch<Brand>(`/api/brands/${id}`, brand);
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...updated, createdAt: new Date(updated.createdAt) } : b)));
  };

  const deleteBrand = async (id: string) => {
    const response = await apiDelete(`/api/brands/${id}`);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    return response;
  };

  const addUser = async (user: Omit<User, 'id' | 'createdAt'> & { password?: string }) => {
    const created = await apiPost<User>('/api/users', user);
    setUsers((prev) => [...prev, { ...created, createdAt: new Date(created.createdAt) }]);
  };

  const updateUser = async (id: string, updates: Partial<User> & { password?: string }) => {
    const updated = await apiPatch<User>(`/api/users/${id}`, updates);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...updated, createdAt: new Date(updated.createdAt) } : u)));
  };

  const deleteUser = async (id: string) => {
    await apiDelete(`/api/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const value = {
    items,
    categories,
    brands,
    logs,
    users,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
    addUser,
    updateUser,
    deleteUser,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
