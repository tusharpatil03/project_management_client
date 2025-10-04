import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface IssueStatusBadgeProps {
  status: string;
}

export const IssueStatusBadge = ({ status }: IssueStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status.replace('_', ' ')}
    </span>
  );
};
