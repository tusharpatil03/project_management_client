import React from 'react';

interface IssueDescriptionProps {
  description: string | null;
}

export const IssueDescription: React.FC<IssueDescriptionProps> = ({ description }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-3">
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Description
      </h3>
    </div>
    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
      {description || (
        <span className="italic text-gray-400">
          No description provided.
        </span>
      )}
    </p>
  </div>
);