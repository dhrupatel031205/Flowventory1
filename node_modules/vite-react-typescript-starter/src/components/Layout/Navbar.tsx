import React, { useState, useEffect, useRef } from 'react';
import {
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiSearch,

  FiHome,
  FiPackage,
  FiTag,
  FiUsers,
  FiFileText,
  FiMenu,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Only pages that actually exist
  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: FiHome, description: 'Overview and analytics', path: '/dashboard' },
    { key: 'inventory', label: 'Inventory', icon: FiPackage, description: 'Manage products and stock', path: '/inventory' },
    { key: 'logs', label: 'Activity Logs', icon: FiFileText, description: 'System activity tracking', path: '/logs' },
    { key: 'categories', label: 'Categories', icon: FiTag, adminOnly: true, description: 'Manage categories', path: '/categories' },
    { key: 'brands', label: 'Brands', icon: FiTag, adminOnly: true, description: 'Manage brands', path: '/brands' },
    { key: 'users', label: 'Users', icon: FiUsers, adminOnly: true, description: 'Manage users', path: '/users' },
  ];

  const filteredNavigationItems = navigationItems.filter((item) => !item.adminOnly || user?.role === 'admin');

  const activeClasses = 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
  const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700';

  return (
    <nav className="relative z-40 w-full overflow-x-hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and branding */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-gray-100">Flowventory</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 overflow-hidden">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  title={item.description}
                  className={({ isActive }) => `flex items-center px-2 md:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? activeClasses : inactiveClasses} min-w-0`}
                >
                  <Icon className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle relative overflow-hidden group"
              aria-label="Toggle dark mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                {theme === 'dark' ? <FiSun size={18} className="text-yellow-500" /> : <FiMoon size={18} className="text-gray-700 dark:text-gray-300" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg pointer-events-none" />
            </button>



            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <FiMenu size={20} />
            </button>

            {/* User info and Logout */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'User'}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
                title="Logout"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 dark:border-slate-700 w-full">
            <div className="px-4 py-3 space-y-1">
              {filteredNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) => `w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
