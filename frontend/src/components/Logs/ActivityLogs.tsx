import React, { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiActivity, FiX, FiChevronDown, FiClock } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const ActivityLogs: React.FC = () => {
  const { logs, users } = useData();
  useAuth(); // kept for parity (if later needed)

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [sortBy, setSortBy] = useState<'timestamp' | 'action' | 'itemName'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const dateInvalid = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return new Date(dateRange.startDate) > new Date(dateRange.endDate);
  }, [dateRange]);

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs.filter(log => {
      const matchesSearch = log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = !filterAction || log.action === filterAction;
      const matchesUser = !filterUser || String(log.userId) === filterUser; // normalize type for comparison
      let matchesDateRange = true;
      if (dateRange.startDate || dateRange.endDate) {
        const logDate = new Date(log.timestamp);
        if (dateRange.startDate) {
          matchesDateRange = matchesDateRange && logDate >= new Date(dateRange.startDate);
        }
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && logDate <= endDate;
        }
      }
      return matchesSearch && matchesAction && matchesUser && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'itemName':
          comparison = a.itemName.localeCompare(b.itemName);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [logs, searchTerm, filterAction, filterUser, dateRange, sortBy, sortOrder]);

  const formatDateTime = (date: Date) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(new Date(date));

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handleSort = (field: 'timestamp' | 'action' | 'itemName') => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterAction('');
    setFilterUser('');
    setDateRange({ startDate: '', endDate: '' });
  };

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    const toISO = (d: Date) => d.toISOString().split('T')[0];
    setDateRange({ startDate: toISO(start), endDate: toISO(end) });
  };

  const activeFilters = [filterAction, filterUser, dateRange.startDate, dateRange.endDate].filter(Boolean).length;

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Item Name', 'User', 'Details'].join(','),
      ...filteredAndSortedLogs.map(log => [
        formatDateTime(log.timestamp),
        log.action,
        `"${log.itemName}"`,
        log.userName,
        `"${log.details || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const actionBadge = (action: string) => {
    const classes: Record<string, string> = {
      created: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      updated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    const cls = classes[action] || 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200';
    return <span className={`badge-status ${cls}`}>{action.charAt(0).toUpperCase() + action.slice(1)}</span>;
  };

  return (
    <div className="min-h-screen app-shell p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Activity Logs</h1>
            <p className="text-gray-600 dark:text-gray-400">Track all inventory changes and user activities</p>
          </div>
          <button
            onClick={exportLogs}
            className="btn-outlined flex items-center justify-center disabled:opacity-50"
            disabled={filteredAndSortedLogs.length === 0}
          >
            <FiDownload className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card-base p-6 mb-6">
          {/* Top row: search + actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search items or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base pl-12 pr-4 py-3 w-full"
                />
              </div>
            </div>

            {/* Actions: filter toggle + clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-outlined flex items-center ${activeFilters > 0 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filters
                {activeFilters > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">{activeFilters}</span>
                )}
                <FiChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {(searchTerm || activeFilters > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                >
                  <FiX className="w-4 h-4 mr-1" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              {/* Action filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action Type</label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Actions</option>
                  <option value="created">Created</option>
                  <option value="updated">Updated</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>

              {/* User filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User</label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  max={dateRange.endDate || undefined}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-base w-full"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  min={dateRange.startDate || undefined}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input-base w-full"
                />
              </div>

              {/* Quick ranges row spanning full width */}
              <div className="md:col-span-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center"><FiClock className="w-4 h-4 mr-1" /> Quick ranges:</span>
                  <button onClick={() => setQuickRange(1)} className="btn-outlined text-xs py-1 px-3">Today</button>
                  <button onClick={() => setQuickRange(7)} className="btn-outlined text-xs py-1 px-3">Last 7 days</button>
                  <button onClick={() => setQuickRange(30)} className="btn-outlined text-xs py-1 px-3">Last 30 days</button>
                </div>
                {dateInvalid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">Start date cannot be after end date.</p>
                )}
              </div>

              {/* Active filter chips */}
              {(activeFilters > 0) && (
                <div className="md:col-span-4">
                  <div className="flex flex-wrap gap-2">
                    {filterAction && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Action: {filterAction}
                        <button onClick={() => setFilterAction('')} className="ml-2 text-blue-600 dark:text-blue-300"><FiX /></button>
                      </span>
                    )}
                    {filterUser && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        User: {users.find(u => u.id === filterUser)?.name || filterUser}
                        <button onClick={() => setFilterUser('')} className="ml-2 text-green-600 dark:text-green-300"><FiX /></button>
                      </span>
                    )}
                    {dateRange.startDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                        From: {dateRange.startDate}
                        <button onClick={() => setDateRange(prev => ({ ...prev, startDate: '' }))} className="ml-2"><FiX /></button>
                      </span>
                    )}
                    {dateRange.endDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                        To: {dateRange.endDate}
                        <button onClick={() => setDateRange(prev => ({ ...prev, endDate: '' }))} className="ml-2"><FiX /></button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="sticky top-0 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="table-header px-6 py-4 text-left">Action</th>
                  <th className="table-header px-6 py-4 text-left">Item</th>
                  <th className="table-header px-6 py-4 text-left">User</th>
                  <th className="table-header px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center space-x-2">
                      <span>Timestamp</span>
                      <span className="text-xs">{getSortIcon('timestamp')}</span>
                    </div>
                  </th>
                  <th className="table-header px-6 py-4 text-left">Time Ago</th>
                  <th className="table-header px-6 py-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedLogs.map((log, index) => (
                  <tr key={log.id} className={`table-row ${index % 2 === 0 ? 'table-row-striped' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FiActivity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        {actionBadge(log.action)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{log.itemName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {log.itemId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-xs">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{log.userName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {log.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-status bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200">
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {log.details || 'No additional details'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedLogs.length === 0 && (
            <div className="text-center py-10">
              <FiActivity className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3 inline-block" />
              <h5 className="text-gray-600 dark:text-gray-300">No activity logs found</h5>
              <p className="text-gray-500 dark:text-gray-400">
                {logs.length === 0 ? 'No activities have been recorded yet' : 'Try adjusting your search or filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
