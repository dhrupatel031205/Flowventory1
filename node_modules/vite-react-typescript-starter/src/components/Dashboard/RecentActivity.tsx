import React from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

const RecentActivity: React.FC = () => {
  const { logs } = useData();

  // Show only the latest 5 activities (most recent first)
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getActionIcon = (action: string) => {
    const base = 'w-9 h-9 rounded-lg flex items-center justify-center';
    switch (action) {
      case 'created':
        return (
          <div className={`${base} bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400`}>
            <FiPlus />
          </div>
        );
      case 'updated':
        return (
          <div className={`${base} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400`}>
            <FiEdit />
          </div>
        );
      case 'deleted':
        return (
          <div className={`${base} bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400`}>
            <FiTrash2 />
          </div>
        );
      default:
        return null;
    }
  };

  const getActionBadge = (action: string) => {
    const map: Record<string, string> = {
      created: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      updated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[action] || ''}`}>
        {action}
      </span>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="card-base p-6 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
      </div>

      {recentLogs.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No recent activity
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {recentLogs.map((log) => (
            <div key={log.id} className="py-3">
              <div className="flex items-start gap-3">
                {getActionIcon(log.action)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{log.itemName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">by {log.userName}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="mb-1">{getActionBadge(log.action)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(log.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
