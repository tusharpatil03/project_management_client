import { InterfaceIssue, InterfaceUser, InterfaceSprint } from '../../../types';
import { IssueStatusBadge } from './IssueStatusBadge';

interface IssueTableRowProps {
  issue: InterfaceIssue;
  onIssueClick: (issueId: string) => void;
  onAssigneeClick: (issueId: string, currentAssignee?: InterfaceUser) => void;
  onEditClick: (issueId: string) => void;
}

export const IssueTableRow = ({
  issue,
  onIssueClick,
  onAssigneeClick,
  onEditClick,
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

  //when assignee changes
  // const onAssigneeChange = ()=> {
  //   issue.assignee = ;
  // }

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
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          console.log('IssuesId: ', issue.id);
          e.stopPropagation();
          onEditClick(issue.id);
        }}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded hover:underline"
        title="Edit Issue"
      >
        Edit
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
      <td className="px-6 py-4 text-center">
        {renderActions(issue)}
      </td>
    </tr>
  );
};
