export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  description: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  category: Category | null;
  brand: Brand | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
}

export interface InventoryLog {
  id: string;
  action: 'created' | 'updated' | 'deleted';
  itemId: string;
  itemName: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
}

export interface DashboardMetrics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  recentActivities: InventoryLog[];
}
