import { useEffect, useState } from 'react';
import LoadingState from '../LoadingState';

interface BaseTableProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const BaseTable: React.FC<BaseTableProps> = ({
  children,
  className = '',
  loading = false,
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  if (isLoading) {
    return (
      <div
        className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}
      >
        <div className="flex justify-center items-center h-32">
          <LoadingState size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}
    >
      <table className="w-full text-sm text-left text-gray-500">
        {children}
      </table>
    </div>
  );
};

export default BaseTable;
