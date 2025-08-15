import IssueTable from '../Issues/IssuesTable';
import { InterfaceSprint } from '../../../types/types';
import CreateIssue from '../Issues/CreateIssue';
import { useMemo, useState } from 'react';
import CreateIssuesInSprint from './CreateIssue';

interface SprintProps {
  sprint: InterfaceSprint;
  refetch: () => void;
  projectId: string;
}
const Sprint: React.FC<SprintProps> = ({ sprint, refetch, projectId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [createIssueTab, setCreateIssueTab] = useState<boolean>(false);

  const sprintStats = useMemo(() => {
    if (!sprint.issues || sprint.issues.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, todo: 0 };
    }

    const total = sprint.issues.length;
    const completed = sprint.issues.filter(
      (issue) =>
        issue.status?.toLowerCase() === 'done' ||
        issue.status?.toLowerCase() === 'completed'
    ).length;
    const inProgress = sprint.issues.filter(
      (issue) =>
        issue.status?.toLowerCase() === 'in progress' ||
        issue.status?.toLowerCase() === 'in-progress'
    ).length;
    const todo = sprint.issues.filter(
      (issue) =>
        issue.status?.toLowerCase() === 'todo' ||
        issue.status?.toLowerCase() === 'to do'
    ).length;

    return { total, completed, inProgress, todo };
  }, [sprint.issues]);

  const progressPercentage =
    sprintStats.total > 0
      ? Math.round((sprintStats.completed / sprintStats.total) * 100)
      : 0;

  const getSprintStatusInfo = () => {
    const status = sprint.status?.toLowerCase();
    switch (status) {
      case 'active':
      case 'in progress':
        return { color: 'text-blue-600 bg-blue-100', icon: '🏃‍♂️' };
      case 'completed':
      case 'done':
        return { color: 'text-green-600 bg-green-100', icon: '✅' };
      case 'planning':
        return { color: 'text-yellow-600 bg-yellow-100', icon: '📋' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: '📝' };
    }
  };

  const isOverdue =
    sprint.dueDate &&
    new Date(sprint.dueDate) < new Date() &&
    sprint.status?.toLowerCase() !== 'completed' &&
    sprint.status?.toLowerCase() !== 'done';

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString();
  };

  const statusInfo = getSprintStatusInfo();

  const handleCreateIssueSuccess = () => {
    setCreateIssueTab(false);
    refetch();
  };

  if (createIssueTab) {
    return (
      <CreateIssue
        projectId={projectId}
        sprintId={sprint.id}
        setCreateTaskTab={setCreateIssueTab}
        onSuccess={handleCreateIssueSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Sprint Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? 'Collapse sprint' : 'Expand sprint'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {sprint.title}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
              >
                {statusInfo.icon} {sprint.status || 'Not Set'}
              </span>
              {isOverdue && (
                <span className="px-3 py-1 text-xs font-medium rounded-full text-red-600 bg-red-100">
                  ⚠️ Overdue
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{sprintStats.completed}</span>
              <span className="mx-1">/</span>
              <span>{sprintStats.total}</span>
              <span className="ml-1">issues</span>
            </div>
          </div>
        </div>

        {/* Sprint Details Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium mr-1">Due:</span>
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {sprint.dueDate ? formatDate(sprint.dueDate) : 'Not set'}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="font-medium mr-1">Progress:</span>
            <span
              className={
                progressPercentage === 100 ? 'text-green-600 font-medium' : ''
              }
            >
              {progressPercentage}%
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="font-medium mr-1">Key:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {sprint.key || 'N/A'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {sprintStats.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Sprint Progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Done: {sprintStats.completed}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                In Progress: {sprintStats.inProgress}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                Todo: {sprintStats.todo}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {sprint.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Sprint Description
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {sprint.description}
            </p>
          </div>
        )}
      </div>

      {/* Issues Section */}
      {isExpanded && (
        <div className="p-6">
          {sprint.issues && sprint.issues.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Sprint Issues ({sprintStats.total})
                </h4>
                {/* {sprint.status?.toLowerCase() === 'active' && (
                  <button
                    onClick={() => setCreateIssueTab(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Issue
                  </button>
                )} */}
              </div>
              <div className="bg-gray-50 rounded-lg p-1">
                <IssueTable issues={sprint.issues} projectId={projectId} />
              </div>
            </div>
          ) : (
            <div className="text-center py-3 bg-gray-50 rounded-lg">
              <div className="w-16 h-6 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No issues yet
              </h3>
              {/* <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                This sprint doesn't have any issues yet. Start by creating your
                first issue to track work for this sprint.
              </p>
              {sprint.status?.toLowerCase() === 'active' && (
                <button
                  onClick={() => setCreateIssueTab(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create First Issue
                </button>
              )} */}
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="px-6 py-4 border-b border-gray-100">
          <CreateIssuesInSprint
            sprint={sprint}
            projectId={projectId}
            onSuccess={handleCreateIssueSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default Sprint;
