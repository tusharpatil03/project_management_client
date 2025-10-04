import React from 'react';

interface IssueStatusProps {
  status: string;
  dueDate?: string;
}

export const IssueStatus: React.FC<IssueStatusProps> = ({ status, dueDate }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
      BLOCKED: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: 'text-red-600',
      };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays <= 3) {
      return {
        text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
        color: 'text-yellow-600',
      };
    }
    return {
      text: date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      color: 'text-gray-600',
    };
  };

  const dueInfo = dueDate ? formatDate(new Date(dueDate).toDateString()) : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
          status
        )}`}
      >
        {status.replace('_', ' ')}
      </span>
      {dueInfo && (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${dueInfo.color}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {dueInfo.text}
        </span>
      )}
    </div>
  );
};