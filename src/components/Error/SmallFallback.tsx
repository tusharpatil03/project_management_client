import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

const SmallFallback: React.FC<Props> = ({ error, onRetry, className }) => {
  return (
    <div
      className={`inline-flex items-center gap-3 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-700 ${className || ''}`}
    >
      <AlertCircle className="w-4 h-4" />
      <div className="flex-1 text-xs">
        <div className="font-medium">Something went wrong</div>
        <div className="truncate text-[11px] opacity-80">{error?.message}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default SmallFallback;
