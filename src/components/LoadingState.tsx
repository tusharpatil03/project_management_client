import React from 'react';
import Loader from './Loader';

type Size = 'sm' | 'md' | 'lg' | 'xl' | number;

interface LoadingStateProps {
  size?: Size;
  fullScreen?: boolean; // whether to center in full viewport
  className?: string; // extra wrapper classes
  bg?: boolean; // whether to show background surface
  message?: string; // optional message under loader
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  fullScreen = true,
  className = '',
  bg = true,
  message,
}) => {
  // map our 'md' to a loader size supported by Loader (defaults kept compatible)
  const loaderSize = typeof size === 'number' ? size : size === 'md' ? 'lg' : size;

  const wrapperClasses = `${fullScreen ? 'min-h-screen flex items-center justify-center' : 'flex items-center justify-center'} ${bg ? 'bg-gray-50' : ''} ${className}`;

  return (
    <div className={wrapperClasses}>
      <div className="text-center p-4">
        <Loader size={loaderSize as any} />
        {message && <div className="mt-3 text-sm text-gray-600">{message}</div>}
      </div>
    </div>
  );
};

export default LoadingState;
