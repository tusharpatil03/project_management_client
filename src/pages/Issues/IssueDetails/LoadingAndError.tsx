import React from 'react';
import SharedLoadingState from '../../../components/LoadingState';
import SharedErrorState from '../../../components/Error/ErrorState';

// Thin wrappers to keep the same signatures used across the IssueDetails folder
export const LoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-lg p-8 shadow-xl">
      <SharedLoadingState size="sm" fullScreen={false} message={message} />
    </div>
  </div>
);

export const ErrorState: React.FC<{ error: Error; onRetry: () => void; onClose: () => void }> = ({ error, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 space-y-4">
      <SharedErrorState
        title="Failed to Load Issue"
        message={error.message}
        onRetry={onRetry}
        showRetry={true}
        actions={<button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">Go Back</button>}
      />
    </div>
  </div>
);