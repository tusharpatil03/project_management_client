import React from 'react';

interface IssueFooterProps {
  onClose: () => void;
  onEdit: () => void;
}

export const IssueFooter: React.FC<IssueFooterProps> = ({ onClose, onEdit }) => (
  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 rounded-b-xl px-6 py-4 flex items-center justify-between">
    <button
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      Close
    </button>
    <div className="flex gap-2">
      <button
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        onClick={onEdit}
      >
        Edit Issue
      </button>
    </div>
  </div>
);