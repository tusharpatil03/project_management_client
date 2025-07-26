import React, { useEffect, useState } from 'react';

interface ErrorEvent {
  message: string;
}

export const ErrorAlert: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: CustomEvent<ErrorEvent>) => {
      setError(event.detail.message);
      // Auto-hide after 5 seconds
      setTimeout(() => setError(null), 5000);
    };

    // Add event listener
    window.addEventListener('show-error' as any, handleError);

    // Cleanup
    return () => {
      window.removeEventListener('show-error' as any, handleError);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md shadow-lg">
      <p>{error}</p>
    </div>
  );
};