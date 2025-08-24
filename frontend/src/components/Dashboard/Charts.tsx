import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';

const Charts: React.FC = () => {
  const { items, categories, brands } = useData();

  const brandData = brands.map(brand => ({
    name: brand.name,
    quantity: items.filter(item => item.brand?.id === brand.id).reduce((sum, item) => sum + item.quantity, 0)
  }));

  const categoryData = categories.map(category => ({
    name: category.name,
    count: items.filter(item => item.category?.id === category.id).length
  }));

  const COLORS = ['#0066CC', '#28A745', '#FF6B35', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-base p-0">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">Inventory by Brand</h5>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="quantity" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-base p-0">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0">Items by Category</h5>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
