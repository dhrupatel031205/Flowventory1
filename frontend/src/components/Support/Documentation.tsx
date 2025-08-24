import React, { useState } from 'react';
import { FiBook, FiFileText, FiDownload, FiPrinter, FiChevronRight, FiSearch, FiUser, FiPackage, FiBarChart2, FiSettings } from 'react-icons/fi';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string;
  subsections?: DocSection[];
}

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <FiUser className="w-5 h-5" />,
      description: 'Learn the basics of Flowventory',
      content: `
        <h3 class="text-lg font-semibold mb-3">Welcome to Flowventory</h3>
        <p class="mb-4">Flowventory is a comprehensive inventory management system designed to help businesses track, manage, and optimize their inventory operations.</p>
        
        <h4 class="font-medium mb-2">System Requirements</h4>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>Stable internet connection</li>
          <li>Valid user account with appropriate permissions</li>
        </ul>
        
        <h4 class="font-medium mb-2">First-Time Login</h4>
        <ol class="list-decimal list-inside mb-4 space-y-1">
          <li>Navigate to your Flowventory login page</li>
          <li>Enter your username and password</li>
          <li>Click "Login" to access the dashboard</li>
          <li>Complete the initial setup wizard if prompted</li>
        </ol>
        
        <h4 class="font-medium mb-2">Understanding the Interface</h4>
        <p class="mb-4">The main interface consists of:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Navigation Bar:</strong> Access all main features and pages</li>
          <li><strong>Dashboard:</strong> Overview of your inventory status and key metrics</li>
          <li><strong>Sidebar:</strong> Quick access to frequently used features</li>
          <li><strong>Main Content Area:</strong> Where you interact with specific features</li>
        </ul>
      `
    },
    {
      id: 'inventory-management',
      title: 'Inventory Management',
      icon: <FiPackage className="w-5 h-5" />,
      description: 'Manage your products and stock levels',
      content: `
        <h3 class="text-lg font-semibold mb-3">Managing Inventory Items</h3>
        <p class="mb-4">The inventory management system allows you to add, edit, and track all your products efficiently.</p>
        
        <h4 class="font-medium mb-2">Adding New Items</h4>
        <ol class="list-decimal list-inside mb-4 space-y-1">
          <li>Go to the Inventory page from the navigation menu</li>
          <li>Click the "Add Item" button</li>
          <li>Fill in the required information:
            <ul class="list-disc list-inside ml-6 mt-2">
              <li>Item name and description</li>
              <li>Category and brand</li>
              <li>Quantity and unit of measurement</li>
              <li>Price and cost information</li>
              <li>SKU or product code</li>
            </ul>
          </li>
          <li>Click "Save" to add the item to your inventory</li>
        </ol>
        
        <h4 class="font-medium mb-2">Editing Items</h4>
        <ol class="list-decimal list-inside mb-4 space-y-1">
          <li>Navigate to the Inventory page</li>
          <li>Find the item you want to edit using the search or filter options</li>
          <li>Click the "Edit" button next to the item</li>
          <li>Modify the necessary fields</li>
          <li>Click "Update" to save your changes</li>
        </ol>
        
        <h4 class="font-medium mb-2">Stock Level Management</h4>
        <p class="mb-4">Monitor and maintain optimal stock levels with these features:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Low Stock Alerts:</strong> Get notified when items fall below minimum levels</li>
          <li><strong>Stock Adjustment:</strong> Manually adjust quantities for corrections or updates</li>
          <li><strong>Stock History:</strong> View all changes to stock levels over time</li>
        </ul>
      `
    },
    {
      id: 'dashboard-analytics',
      title: 'Dashboard & Analytics',
      icon: <FiBarChart2 className="w-5 h-5" />,
      description: 'Understand your inventory data and metrics',
      content: `
        <h3 class="text-lg font-semibold mb-3">Dashboard Overview</h3>
        <p class="mb-4">The dashboard provides a comprehensive view of your inventory performance and key metrics.</p>
        
        <h4 class="font-medium mb-2">Key Metrics</h4>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Total Items:</strong> Number of unique products in your inventory</li>
          <li><strong>Total Value:</strong> Combined value of all inventory items</li>
          <li><strong>Low Stock Items:</strong> Items that need restocking</li>
          <li><strong>Recent Activity:</strong> Latest inventory changes and user actions</li>
        </ul>
        
        <h4 class="font-medium mb-2">Charts and Graphs</h4>
        <p class="mb-4">Visual representations help you understand trends and patterns:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Inventory Value Trend:</strong> Track changes in total inventory value over time</li>
          <li><strong>Category Distribution:</strong> See how items are distributed across categories</li>
          <li><strong>Stock Level Analysis:</strong> Monitor stock levels and identify potential issues</li>
          <li><strong>Activity Timeline:</strong> Visual representation of recent inventory activities</li>
        </ul>
        
        <h4 class="font-medium mb-2">Customizing Your Dashboard</h4>
        <p class="mb-4">Personalize your dashboard to focus on the metrics that matter most to you:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li>Rearrange widgets by dragging and dropping</li>
          <li>Resize widgets to show more or less detail</li>
          <li>Filter data by date range, category, or other criteria</li>
          <li>Save custom dashboard layouts for different purposes</li>
        </ul>
      `
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: <FiSettings className="w-5 h-5" />,
      description: 'System configuration and user management',
      content: `
        <h3 class="text-lg font-semibold mb-3">Administrative Functions</h3>
        <p class="mb-4">Administrative functions are available to users with admin privileges and include system configuration, user management, and data maintenance.</p>
        
        <h4 class="font-medium mb-2">User Management</h4>
        <p class="mb-4">Manage user accounts and permissions:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Add Users:</strong> Create new user accounts with specific roles</li>
          <li><strong>Edit Permissions:</strong> Modify user access levels and capabilities</li>
          <li><strong>Deactivate Users:</strong> Disable accounts for former employees</li>
          <li><strong>Reset Passwords:</strong> Help users regain access to their accounts</li>
        </ul>
        
        <h4 class="font-medium mb-2">Category and Brand Management</h4>
        <p class="mb-4">Organize your inventory with proper categorization:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>Create Categories:</strong> Define product categories for better organization</li>
          <li><strong>Manage Brands:</strong> Add and edit brand information</li>
          <li><strong>Hierarchy Setup:</strong> Create parent-child relationships between categories</li>
          <li><strong>Attribute Management:</strong> Define custom attributes for categories</li>
        </ul>
        
        <h4 class="font-medium mb-2">System Settings</h4>
        <p class="mb-4">Configure system-wide settings:</p>
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li><strong>General Settings:</strong> Company information, currency, date formats</li>
          <li><strong>Notification Preferences:</strong> Configure email and in-app notifications</li>
          <li><strong>Security Settings:</strong> Password policies, session timeouts</li>
          <li><strong>Integration Settings:</strong> Connect with external systems and APIs</li>
        </ul>
      `
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSectionData = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Documentation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive guides and documentation for Flowventory
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn-outlined flex items-center space-x-2">
                <FiPrinter className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="btn-outlined flex items-center space-x-2">
                <FiDownload className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 input-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-base p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {section.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{section.title}</div>
                      <div className="text-xs opacity-75 truncate">{section.description}</div>
                    </div>
                    {activeSection === section.id && (
                      <FiChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-base p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {activeSectionData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {activeSectionData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeSectionData.description}
                  </p>
                </div>
              </div>
              
              <div 
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: activeSectionData.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
