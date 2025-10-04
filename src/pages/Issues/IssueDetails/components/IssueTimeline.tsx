import React from 'react';

interface IssueTimelineProps {
  createdAt: string;
  updatedAt: string;
}

export const IssueTimeline: React.FC<IssueTimelineProps> = ({ createdAt, updatedAt }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
      Timeline
    </h4>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500 text-xs mb-1">Created</p>
        <p className="text-gray-900 font-medium">
          {new Date(createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-xs mb-1">Last Updated</p>
        <p className="text-gray-900 font-medium">
          {new Date(updatedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  </div>
);