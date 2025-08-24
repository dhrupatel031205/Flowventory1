import React, { useState } from 'react';
import { FiCode, FiCopy, FiExternalLink, FiSearch, FiLock, FiGlobe, FiDatabase } from 'react-icons/fi';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  authentication: boolean;
  responseExample: string;
  statusCode: number;
}

const ApiReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user and receive access token',
      authentication: false,
      responseExample: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}`,
      statusCode: 200
    },
    {
      method: 'GET',
      path: '/api/items',
      description: 'Retrieve all inventory items with pagination and filtering',
      authentication: true,
      responseExample: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "category": "Electronics",
      "quantity": 15,
      "price": 999.99
    }
  ]
}`,
      statusCode: 200
    },
    {
      method: 'POST',
      path: '/api/items',
      description: 'Create a new inventory item',
      authentication: true,
      responseExample: `{
  "success": true,
  "data": {
    "id": 26,
    "name": "Wireless Mouse",
    "quantity": 50,
    "price": 29.99
  }
}`,
      statusCode: 201
    }
  ];

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'POST':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FiCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                API Reference
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete API documentation for integrating with Flowventory
              </p>
            </div>
          </div>
        </div>

        {/* API Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-base p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                <FiGlobe className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Base URL</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              https://api.flowventory.com/v1
            </p>
          </div>
          
          <div className="card-base p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FiLock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Authentication</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bearer token in Authorization header
            </p>
          </div>
          
          <div className="card-base p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FiDatabase className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rate Limit</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              1000 requests per hour
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 input-base"
            />
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {filteredEndpoints.map((endpoint, index) => (
            <div key={index} className="card-base overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-900 dark:text-gray-100">
                      {endpoint.path}
                    </code>
                    {endpoint.authentication && (
                      <FiLock className="w-4 h-4 text-gray-400" title="Requires authentication" />
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    title="Copy endpoint"
                  >
                    {copiedEndpoint === `${endpoint.method} ${endpoint.path}` ? (
                      <FiCopy className="w-4 h-4 text-green-600" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {endpoint.description}
                </p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response Example</h4>
                  <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-gray-800 dark:text-gray-200">{endpoint.responseExample}</code>
                  </pre>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Status Code: {endpoint.statusCode}</span>
                  <a
                    href="#"
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>Test in Console</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="card-base p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Need More Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Check out our comprehensive documentation or contact our support team for assistance with API integration.
            </p>
            <div className="flex space-x-4">
              <a href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
                View Documentation
              </a>
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiReference;
