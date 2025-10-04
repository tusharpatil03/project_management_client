import React from 'react';
import { InterfaceIssue, InterfaceUser, InterfaceSprint } from '../../../../types/types';
import { IssueStatusBadge } from './IssueStatusBadge';
import Avatar from '../../../../components/Profile/Avatar';

interface IssueTableRowProps {
  issue: InterfaceIssue;
  isSelected: boolean;
  onCheckboxChange: (issueId: string, checked: boolean) => void;
  onIssueClick: (issueId: string) => void;
  onAssigneeClick: (issueId: string, currentAssignee?: InterfaceUser) => void;
  onDeleteClick: (issueId: string) => void;
}

export const IssueTableRow = ({
  issue,
  isSelected,
  onCheckboxChange,
  onIssueClick,
  onAssigneeClick,
  onDeleteClick,
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

  const renderSprintInfo = (sprint: InterfaceSprint | null) => {
    if (!sprint) return '-';
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          sprint.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : sprint.status === 'PLANNED'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {sprint.title}
      </span>
    );
  };

  const renderAssignee = (assignee: InterfaceUser | null | undefined) => {
    if (!assignee) {
      return (
        <button
          onClick={() => onAssigneeClick(issue.id)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Assign
        </button>
      );
    }

    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onAssigneeClick(issue.id, assignee)}
      >
        <Avatar
          firstName={assignee.firstName}
          lastName={assignee.lastName}
          email={assignee.email}
          size="small"
        />
        <span className="text-sm">
          {assignee.firstName} {assignee.lastName}
        </span>
      </div>
    );
  };

  return (
    <tr
      className={`border-b hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onCheckboxChange(issue.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onIssueClick(issue.id)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium"
        >
          {issue.title}
        </button>
      </td>
      <td className="px-6 py-4">
        <span className="capitalize">{issue.type.toLowerCase()}</span>
      </td>
      <td className="px-6 py-4">{renderSprintInfo(issue.sprint)}</td>
      <td className="px-6 py-4">{renderAssignee(issue.assignee)}</td>
      <td className="px-6 py-4">
        {issue.dueDate ? formatDate(String(issue.dueDate)) : '-'}
      </td>
      <td className="px-6 py-4">
        <IssueStatusBadge status={issue.status} />
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onDeleteClick(issue.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
