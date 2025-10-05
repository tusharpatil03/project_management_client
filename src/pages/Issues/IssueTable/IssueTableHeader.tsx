import React from 'react';

interface IssueTableHeaderProps {
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort?: (key: string) => void;
}

export const IssueTableHeader = ({
  isAllSelected,
  onSelectAll,
  sortConfig,
  onSort,
}: IssueTableHeaderProps) => {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th className="px-6 py-3">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('title')}
        >
          Title{getSortIndicator('title')}
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('type')}
        >
          Type{getSortIndicator('type')}
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('sprint')}
        >
          Sprint{getSortIndicator('sprint')}
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('assignee')}
        >
          Assignee{getSortIndicator('assignee')}
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('dueDate')}
        >
          Due Date{getSortIndicator('dueDate')}
        </th>
        <th 
          className="px-6 py-3 text-left cursor-pointer"
          onClick={() => handleSort('status')}
        >
          Status{getSortIndicator('status')}
        </th>
        <th className="px-6 py-3 text-center">
          Actions
        </th>
      </tr>
    </thead>
  );
};
