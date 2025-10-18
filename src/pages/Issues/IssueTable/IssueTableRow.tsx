import { InterfaceIssue, InterfaceUser, InterfaceSprint } from '../../../types';
import { IssueStatusBadge } from './IssueStatusBadge';
import { Edit, Trash2 } from 'lucide-react';

interface IssueTableRowProps {
  issue: InterfaceIssue;
  onIssueClick: (issueId: string) => void;
  onAssigneeClick: (issueId: string, currentAssignee?: InterfaceUser) => void;
  onEditClick: (issueId: string) => void;
  onDeletClick: (issueId: string) => void;
}

export const IssueTableRow = ({
  issue,
  onIssueClick,
  onAssigneeClick,
  onEditClick,
  onDeletClick,
}: IssueTableRowProps) => {
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render helpers
  const renderIssueType = (type: string) => (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        type === 'bug'
          ? 'bg-red-100 text-red-800'
          : type === 'feature'
            ? 'bg-green-100 text-green-800'
            : type === 'task'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );

  const renderSprintInfo = (sprint: InterfaceSprint) => {
    if (!sprint) {
      return <span className="text-gray-400"></span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {sprint.key}
        </div>
      </div>
    );
  };

  const renderAssignee = (assignee: any, issueId: string) => {
    if (!assignee) {
      return <span className="text-gray-400">Unassigned</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {assignee.firstName[0]}
          {assignee.lastName[0]}
        </div>
        <span
          onClick={() => {
            onAssigneeClick(issueId, assignee);
          }}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          {assignee.firstName} {assignee.lastName}
        </span>
      </div>
    );
  };

  const renderDueDate = (dueDate: string | null) => {
    if (!dueDate) {
      return <span className="text-gray-400">No due date</span>;
    }

    const date = new Date(dueDate);
    const isOverdue = date < new Date();
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <span
        className={`${
          isOverdue
            ? 'text-red-600 font-medium'
            : isToday
              ? 'text-orange-600 font-medium'
              : ''
        }`}
      >
        {date.toLocaleDateString()}
        {isOverdue && ' (Overdue)'}
        {isToday && ' (Today)'}
      </span>
    );
  };

  const renderActions = (issue: InterfaceIssue) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(issue.id);
        }}
        className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-md text-blue-600 hover:bg-blue-50 transition"
        title="Edit Issue"
        aria-label="Edit Issue"
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          // small safeguard: confirm deletion
          const ok = window.confirm(
            'Are you sure you want to delete this issue?'
          );
          if (ok) onDeletClick(issue.id);
        }}
        className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-md text-red-600 hover:bg-red-50 transition"
        title="Delete Issue"
        aria-label="Delete Issue"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <button
          onClick={() => onIssueClick(issue.id)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium"
        >
          {issue.title}
        </button>
      </td>
      <td className="px-6 py-4">{renderIssueType(issue.type.toLowerCase())}</td>
      <td className="px-6 py-4">{renderSprintInfo(issue.sprint)}</td>
      <td className="px-6 py-4">{renderAssignee(issue.assignee, issue.id)}</td>
      <td className="px-6 py-4">
        {renderDueDate(issue.dueDate.toLocaleString())}
      </td>
      <td className="px-6 py-4">
        <IssueStatusBadge status={issue.status} />
      </td>
      <td className="px-6 py-4 text-center">{renderActions(issue)}</td>
    </tr>
  );
};
