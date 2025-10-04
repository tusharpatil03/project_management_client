import React from 'react';
import Loader from '../../../../components/Loader';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  onClose: () => void;
}

export const LoadingState = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-lg p-8 shadow-xl">
      <Loader size="sm" />
    </div>
  </div>
);

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-600"
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
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Failed to Load Issue
          </h3>
          <p className="mt-1 text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);