import React, { useState } from 'react';
import { FiHelpCircle, FiSearch, FiChevronDown, FiChevronRight, FiBook, FiVideo, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface QuickLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'How do I add new inventory items?',
      answer: 'Navigate to the Inventory page and click the "Add Item" button. Fill in the required fields including name, category, brand, quantity, and price. Click "Save" to add the item to your inventory.',
      category: 'Inventory Management'
    },
    {
      question: 'How can I manage categories and brands?',
      answer: 'Go to the Categories or Brands page in the navigation menu. From there, you can add, edit, or delete categories and brands. Note that these features are only available to admin users.',
      category: 'Management'
    },
    {
      question: 'How do I track inventory changes?',
      answer: 'The Activity Logs page shows all inventory changes, user actions, and system events. You can filter by date, user, or action type to find specific activities.',
      category: 'Tracking & Logs'
    },
    {
      question: 'What do the dashboard statistics mean?',
      answer: 'The dashboard provides an overview of your inventory including total items, low stock alerts, recent activities, and performance metrics. Each card shows different aspects of your inventory health.',
      category: 'Dashboard'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Contact your system administrator to reset your password. For security reasons, password resets can only be performed by admin users.',
      category: 'Account'
    },
    {
      question: 'Can I export inventory data?',
      answer: 'Currently, data export functionality is being developed. You can view all inventory data in the Inventory table and use browser print functionality to save records.',
      category: 'Data Management'
    }
  ];

  const quickLinks: QuickLink[] = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of Flowventory in 5 minutes',
      icon: <FiBook className="w-5 h-5" />,
      link: '/docs#getting-started'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: <FiVideo className="w-5 h-5" />,
      link: '/docs#videos'
    },
    {
      title: 'API Documentation',
      description: 'Integrate Flowventory with your systems',
      icon: <FiExternalLink className="w-5 h-5" />,
      link: '/api-docs'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: <FiMessageSquare className="w-5 h-5" />,
      link: '/contact'
    }
  ];

  const categories = [...new Set(faqItems.map(item => item.category))];
  
  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to common questions and get help with Flowventory
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 input-base text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.link}
                className="card-base p-6 hover:shadow-soft-hover transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          
          {searchQuery && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}

          <div className="space-y-4">
            {categories.map(category => {
              const categoryFAQs = filteredFAQs.filter(item => item.category === category);
              if (categoryFAQs.length === 0) return null;

              const isExpanded = expandedCategory === category;

              return (
                <div key={category} className="card-base overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {category}
                    </h3>
                    {isExpanded ? (
                      <FiChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FiChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-slate-700">
                      {categoryFAQs.map((faq, index) => (
                        <div key={index} className="p-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="card-base p-8 text-center">
              <FiHelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse our documentation.
              </p>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="card-base p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Still need help?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our support team is here to help you with any questions or issues.
                </p>
              </div>
              <a
                href="/contact"
                className="btn-primary whitespace-nowrap"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
