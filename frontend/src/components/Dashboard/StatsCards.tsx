import React from 'react';
import { FiPackage, FiAlertTriangle, FiXCircle, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

const StatsCards: React.FC = () => {
  const { items } = useData();

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = items.filter(item => item.status === 'out-of-stock').length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const stats = [
    {
      title: 'Total Items',
      value: totalItems.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: FiPackage,
      bgColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Low Stock',
      value: lowStockItems.toString(),
      change: '-5%',
      changeType: 'decrease' as const,
      icon: FiAlertTriangle,
      bgColor: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.toString(),
      change: '+2',
      changeType: 'increase' as const,
      icon: FiXCircle,
      bgColor: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+8.5%',
      changeType: 'increase' as const,
      icon: FiDollarSign,
      bgColor: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.changeType === 'increase' ? FiTrendingUp : FiTrendingDown;
        
        return (
          <div 
            key={index} 
            className="stats-card group hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`
                ${stat.iconBg} ${stat.iconColor} 
                w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 group-hover:scale-110
              `}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                ${stat.changeType === 'increase' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }
              `}>
                <TrendIcon className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4">
              <div className={`
                h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
                ${stat.borderColor} border-l-4
              `}>
                <div 
                  className={`
                    h-full bg-gradient-to-r ${stat.bgColor} rounded-full
                    transition-all duration-1000 ease-out
                  `}
                  style={{ 
                    width: `${Math.min(100, (parseFloat(stat.value.replace(/[^0-9.-]+/g, '')) / 100) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
