import React from 'react';
import StatsCards from './StatsCards';
import Charts from './Charts';
import RecentActivity from './RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your inventory management system
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatsCards />
        </div>
        
        {/* Charts Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Charts />
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="lg:col-span-2">
            {/* Additional charts or widgets placeholder */}
            <div className="card-base p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">94%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Inventory Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.3 days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Processing Time</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
