import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  showRetry?: boolean;
  actions?: React.ReactNode; // custom action buttons
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = null,
  onRetry,
  showRetry = false,
  actions,
  className = '',
}) => (
  <div className={`min-h-[280px] flex items-center justify-center ${className}`}>
    <div className="text-center max-w-md">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}

      <div className="flex items-center justify-center gap-3">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        )}

        {actions}
      </div>
    </div>
  </div>
);

export default ErrorState;
