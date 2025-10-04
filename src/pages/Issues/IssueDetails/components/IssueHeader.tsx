import React from 'react';

interface IssueHeaderProps {
  issueId: string;
  onClose: () => void;
}

export const IssueHeader: React.FC<IssueHeaderProps> = ({ issueId, onClose }) => (
  <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between z-10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Issue Details
        </h2>
        <p className="text-xs text-gray-500">ID: {issueId}</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      aria-label="Close details"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);