import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'lg' | 'xl';
}

const Loader: React.FC<LoaderProps> = ({ size = 'lg' }) => {
  // Size configuration
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    lg: 'h-10 w-10 border-4',
    xl: 'h-16 w-16 border-[6px]',
  };

  return (
    <div
      className={`rounded-full animate-spin border-transparent border-t-current ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
