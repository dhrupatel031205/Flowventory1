import React from 'react';
import { 
  FiHome, 
  FiPackage, 
  FiBarChart, 
  FiTag, 
  FiUsers, 
  FiFileText,
  FiSettings,
  FiTruck,
  FiBell
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: FiHome,
      description: 'Overview and analytics'
    },
    { 
      key: 'inventory', 
      label: 'Inventory', 
      icon: FiPackage,
      description: 'Manage products and stock'
    },
    { 
      key: 'suppliers', 
      label: 'Suppliers', 
      icon: FiUsers,
      description: 'Supplier management'
    },
    { 
      key: 'orders', 
      label: 'Orders', 
      icon: FiTruck,
      description: 'Track and manage orders'
    },
    { 
      key: 'reports', 
      label: 'Reports', 
      icon: FiBarChart,
      description: 'Generate reports and insights'
    },
    { 
      key: 'notifications', 
      label: 'Notifications', 
      icon: FiBell,
      description: 'System notifications'
    },
    { 
      key: 'logs', 
      label: 'Activity Logs', 
      icon: FiFileText,
      description: 'System activity tracking'
    },
    { 
      key: 'categories', 
      label: 'Categories', 
      icon: FiTag, 
      adminOnly: true,
      description: 'Manage categories'
    },
    { 
      key: 'brands', 
      label: 'Brands', 
      icon: FiTag, 
      adminOnly: true,
      description: 'Manage brands'
    },
    { 
      key: 'users', 
      label: 'User Management', 
      icon: FiUsers, 
      adminOnly: true,
      description: 'Manage users'
    },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: FiSettings,
      description: 'System settings'
    },
  ];

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && window.innerWidth < 768 && (
        <div 
          className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky inset-y-0 left-0 z-40 w-64 h-screen
        bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo and branding */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Flowventory
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inventory Management
              </p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {menuItems.slice(0, 7).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'nav-item-active bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'nav-item text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }
                    `}
                    title={item.description}
                  >
                    <Icon className={`
                      nav-icon flex-shrink-0
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }
                    `} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate">{item.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin section */}
          {user?.role === 'admin' && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Administration
              </h3>
              <div className="space-y-1">
                {menuItems.slice(7, 10).map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabClick(item.key)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'nav-item-active bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'nav-item text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }
                      `}
                      title={item.description}
                    >
                      <Icon className={`
                        nav-icon flex-shrink-0
                        ${isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }
                      `} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate">{item.label}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="mt-6">
            <div className="space-y-1">
              {menuItems.slice(10).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'nav-item-active bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'nav-item text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }
                    `}
                    title={item.description}
                  >
                    <Icon className={`
                      nav-icon flex-shrink-0
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }
                    `} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate">{item.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role || 'Guest'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
