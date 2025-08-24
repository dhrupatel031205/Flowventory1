import React from 'react';
import { FiHome, FiPackage, FiTag, FiUsers, FiFileText, FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Inventory', path: '/inventory', icon: FiPackage },
    { name: 'Activity Logs', path: '/logs', icon: FiFileText },
    { name: 'Categories', path: '/categories', icon: FiTag },
    { name: 'Brands', path: '/brands', icon: FiTag },
    { name: 'Users', path: '/users', icon: FiUsers },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Documentation', path: '/docs' },
    { name: 'API Reference', path: '/api-docs' },
    { name: 'Contact Support', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'GDPR', path: '/gdpr' },
  ];

  return (
    <footer className="mt-8 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Flowventory</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Inventory Management Simplified</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              Streamline your inventory management with our powerful, user-friendly platform designed to help businesses track, manage, and optimize their stock levels efficiently.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                <FiLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                    >
                      <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-3 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors duration-200"></span>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMail className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">support@flowventory.com</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For technical support</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiPhone className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">123 Business Ave</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Suite 100, New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <p>© {new Date().getFullYear()} Flowventory. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                {legalLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Built with ❤️ for efficient inventory management
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
