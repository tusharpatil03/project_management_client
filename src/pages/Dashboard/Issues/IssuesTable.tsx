import { useState } from 'react';
import { InterfaceIssue, InterfaceSprint } from '../../../types/types';
import IssueDetails from './IssueDetails';
import DeleteTab from '../../../components/Actions/DeleteTab';
import { useMutation, useQuery } from '@apollo/client';
import { ASSIGN_ISSUE, DELETE_ISSUES } from '../../../graphql/Mutation/issue';
import { showError } from '../../../utils/showError';
import React from 'react';
import Loader from '../../../components/Loader';
import { GET_ALL_MEMBERS } from '../../../graphql/Query/team';
import Members from '../../../components/Team/Members';
import BaseTable from '../../../components/Table/BaseTable';

interface IssueTableProps {
  issues: InterfaceIssue[];
  projectId: string;
  onIssueUpdate?: () => void;
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  projectId,
  onIssueUpdate,
}) => {
  const [viewIssueTab, setViewIssueTab] = useState<boolean>(false);
  const [issueId, setIssueId] = useState<string>();
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [showDeleteTab, setShowDeleteTab] = useState<boolean>(false);
  const [membersTab, setMemberTab] = useState<boolean>(false);

  const [deleteIssue, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_ISSUES, {
      onCompleted: (data) => {
        if (data?.removeIssue?.success) {
          setSelectedIssues(new Set());
          setShowDeleteTab(false);
          onIssueUpdate?.();
        } else {
          showError(data?.removeIssue?.message || 'Delete failed');
        }
      },
      onError: (error) => {
        showError(error.message || 'Delete failed');
      },
    });

  // Event handlers
  const handleIssueClick = (issueId: string) => {
    setIssueId(issueId);
    setViewIssueTab(true);
  };

  const handleCheckboxChange = (issueId: string, checked: boolean) => {
    const newSelected = new Set(selectedIssues);
    if (checked) {
      newSelected.add(issueId);
    } else {
      newSelected.delete(issueId);
    }
    setSelectedIssues(newSelected);
    setShowDeleteTab(newSelected.size > 0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIssues(new Set(issues.map((issue) => issue.id)));
    } else {
      setSelectedIssues(new Set());
    }
    setShowDeleteTab(checked && issues.length > 0);
  };

  const handleDeleteSelected = async () => {
    const issueIds = Array.from(selectedIssues);
    if (issueIds.length === 0) return;

    try {
      for (const issueId of issueIds) {
        await deleteIssue({
          variables: {
            input: { issueId, projectId },
          },
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError('Failed to delete issues');
    }
  };

  const isAllSelected =
    selectedIssues.size === issues.length && issues.length > 0;

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

  // const renderDescription = (description: string) => {
  //   if (!description) {
  //     return <span className="text-gray-400"></span>;
  //   }

  //   return (
  //     <div className="flex items-center gap-2">
  //       {description && (
  //         <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">
  //           {description}
  //         </p>
  //       )}
  //       <p>Not Provided</p>
  //     </div>
  //   );
  // };

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

  const renderAssignee = (assignee: any) => {
    if (!assignee) {
      return <span className="text-gray-400">Unassigned</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {assignee.firstName[0]}
          {assignee.lastName[0]}
        </div>
        <span>
          {assignee.firstName} {assignee.lastName}
        </span>
        <button onClick={() => setMemberTab(true)}>^</button>
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
          e.stopPropagation();
          handleIssueClick(issue.id);
        }}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        title="View Details"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );

  const getMembers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [memberId, setMemberId] = useState<string>();

    const { data, loading, error } = useQuery(GET_ALL_MEMBERS);

    const [changeAssignee, { error: assigneeError, loading: assigneeLoading }] =
      useMutation(ASSIGN_ISSUE);

    const handleMemberClick = (memberId: string) => {
      setMemberId(memberId);
      setMemberTab(false);
      setSearchTerm('');
      changeStatus();
    };

    if (assigneeError) {
      showError('failed to assign issue');
    }

    if (assigneeLoading) {
      return <Loader size="sm" />;
    }

    const changeStatus = async () => {
      const res = await changeAssignee({
        variables: {
          input: {
            assigneeId: projectId,
            projectId: issueId,
            issueId: memberId,
          },
        },
      });

      showError(res.data.assignIssue.message);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <Members
            members={data.getProjectTeamsMembers}
            handleClick={handleMemberClick}
            error={error?.message}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={() => {}}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIssues.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-700 font-medium">
              {selectedIssues.size} issue{selectedIssues.size > 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="h-4 w-px bg-blue-300"></div>
            <button
              onClick={() => {
                setSelectedIssues(new Set());
                setShowDeleteTab(false);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear selection
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Handle bulk status change
                console.log(
                  'Bulk status change for:',
                  Array.from(selectedIssues)
                );
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Change Status
            </button>
            <button
              onClick={() => {
                // Handle bulk assignee change
                console.log(
                  'Bulk assignee change for:',
                  Array.from(selectedIssues)
                );
              }}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Assign To
            </button>
            <button
              onClick={() => setShowDeleteTab(true)}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Issues Table */}
      <BaseTable loading={deleteLoading}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left">Title</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Sprint</th>
            <th className="px-6 py-3 text-left">Assignee</th>
            <th className="px-6 py-3 text-left">Due Date</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      No issues found
                    </p>
                    <p className="text-sm text-gray-500">
                      Create your first issue to get started.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr
                key={issue.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  selectedIssues.has(issue.id) ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIssues.has(issue.id)}
                    onChange={(e) =>
                      handleCheckboxChange(issue.id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleIssueClick(issue.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium"
                  >
                    {issue.title}
                  </button>
                </td>
                <td className="px-6 py-4">{renderIssueType(issue.type)}</td>
                <td className="px-6 py-4">{renderSprintInfo(issue.sprint)}</td>
                <td className="px-6 py-4">{renderAssignee(issue.assignee)}</td>
                <td className="px-6 py-4">
                  {renderDueDate(String(issue.dueDate))}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : issue.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : issue.status === 'closed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {issue.status?.replace('_', ' ').toUpperCase() || 'OPEN'}
                  </span>
                </td>
                <td className="px-6 py-4">{renderActions(issue)}</td>
              </tr>
            ))
          )}
        </tbody>
      </BaseTable>

      {/* Issue Details Modal */}
      {viewIssueTab && issueId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <IssueDetails
              setIssueTab={setViewIssueTab}
              issueId={issueId}
              onIssueUpdates={onIssueUpdate}
            />
          </div>
        </div>
      )}

      {/**Members tab to assign issue*/}
      {membersTab && getMembers()}

      {/* Delete Confirmation Modal */}
      {showDeleteTab && selectedIssues.size > 0 && (
        <DeleteTab
          handleDelete={handleDeleteSelected}
          setDeleteTab={setShowDeleteTab}
          loading={deleteLoading}
          error={deleteError}
          message={
            selectedIssues.size === 1
              ? 'Are you sure you want to delete this issue? This action cannot be undone.'
              : `Are you sure you want to delete ${selectedIssues.size} issues? This action cannot be undone.`
          }
        />
      )}
    </div>
  );
};

export default IssueTable;
