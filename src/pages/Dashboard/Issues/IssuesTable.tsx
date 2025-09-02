import { useCallback, useEffect, useState } from 'react';
import { InterfaceIssue, InterfaceSprint } from '../../../types/types';
import IssueDetails from './IssueDetails';
import DeleteTab from '../../../components/Actions/DeleteTab';
import { useMutation, useQuery } from '@apollo/client';
import {
  ASSIGN_ISSUE,
  DELETE_ISSUES,
  REMOVE_ASSIGNEE,
} from '../../../graphql/Mutation/issue';
import { showError } from '../../../utils/showError';
import React from 'react';
import LoadingState from '../../../components/LoadingState';
import { GET_ALL_MEMBERS } from '../../../graphql/Query/team';
import Members from '../../../components/Team/Members';
import BaseTable from '../../../components/Table/BaseTable';
import { AlertCircle, CheckCircle, Search, Users, X } from 'lucide-react';
import Avatar from '../../../components/Profile/Avatar';
import { showSuccess } from '../../../utils/showSuccess';

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
  const [currentAssignee, setCurrentAssignee] = useState<string>();

  const [deleteIssue, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_ISSUES, {
      onCompleted: (data) => {
        if (data?.removeIssue?.success) {
          setSelectedIssues(new Set());
          setShowDeleteTab(false);
          console.log('--------------Issue Deleted-----------');
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
      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
        type === 'bug'
          ? 'bg-red-100 text-red-700'
          : type === 'feature'
            ? 'bg-green-100 text-green-700'
            : type === 'task'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );

  const renderSprintInfo = (sprint: InterfaceSprint) => {
    if (!sprint) {
      return <span className="text-gray-400 text-xs">-</span>;
    }

    return (
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {sprint.key}
        </div>
      </div>
    );
  };

  const renderAssignee = (assignee: any, issueId: string) => {
    if (!assignee) {
      return <span className="text-gray-400 text-xs">Unassigned</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {assignee.firstName[0]}
          {assignee.lastName[0]}
        </div>
        <span className="text-xs">
          {assignee.firstName} {assignee.lastName}
        </span>
        <button
          onClick={() => {
            setMemberTab(true);
            setCurrentAssignee(assignee.id);
            setIssueId(issueId);
          }}
          className="text-gray-500 hover:text-gray-700 text-xs"
        >
          ^
        </button>
      </div>
    );
  };

  const renderDueDate = (dueDate: string | null) => {
    if (!dueDate) {
      return <span className="text-gray-400 text-xs">No due date</span>;
    }

    const date = new Date(dueDate);
    const isOverdue = date < new Date();
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <span
        className={`text-xs ${
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

  return (
    <div className="space-y-3">
      {/* Bulk Actions Bar */}
      {selectedIssues.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-700 font-medium text-sm">
              {selectedIssues.size} issue{selectedIssues.size > 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="h-4 w-px bg-blue-300"></div>
            <button
              onClick={() => {
                setSelectedIssues(new Set());
                setShowDeleteTab(false);
              }}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Issues Table */}
      <BaseTable loading={deleteLoading}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Sprint</th>
            <th className="px-4 py-2 text-left">Assignee</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-10 h-10 text-gray-300"
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
                    <p className="text-base font-medium text-gray-900">
                      No issues found
                    </p>
                    <p className="text-xs text-gray-500">
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
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIssues.has(issue.id)}
                    onChange={(e) =>
                      handleCheckboxChange(issue.id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleIssueClick(issue.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-left font-medium text-sm"
                  >
                    {issue.title}
                  </button>
                </td>
                <td className="px-4 py-3">{renderIssueType(issue.type)}</td>
                <td className="px-4 py-3">{renderSprintInfo(issue.sprint)}</td>
                <td className="px-4 py-3">
                  {renderAssignee(issue.assignee, issue.id)}
                </td>
                <td className="px-4 py-3">
                  {renderDueDate(String(issue.dueDate))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      issue.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : issue.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : issue.status === 'closed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {issue.status?.replace('_', ' ').toUpperCase() || 'OPEN'}
                  </span>
                </td>
                <td className="px-4 py-3">{renderActions(issue)}</td>
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
      {membersTab && (
        <GetMembers
          projectId={projectId}
          issueId={issueId as string}
          setMemberTab={setMemberTab}
          currentAssigneeId={currentAssignee}
        />
      )}

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

interface GetMembersProps {
  projectId: string;
  issueId: string;
  setMemberTab: (value: boolean) => void;
  currentAssigneeId?: string;
  onAssignmentChange?: (assigneeId: string, name: string) => void;
}

const GetMembers: React.FC<GetMembersProps> = ({
  projectId,
  issueId,
  setMemberTab,
  currentAssigneeId,
  onAssignmentChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ALL_MEMBERS, {
    variables: { projectId },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const [changeAssignee] = useMutation(ASSIGN_ISSUE, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.assignIssue?.success) {
        const assignedMember = members?.find(
          (m: any) => m.id === selectedMemberId
        );
        const memberName = assignedMember
          ? `${assignedMember.firstName} ${assignedMember.lastName}`
          : 'Unknown';

        showSuccess(`Issue successfully assigned to ${memberName}`);
        onAssignmentChange?.(selectedMemberId!, memberName);
        handleClose();
      } else {
        showError(data?.assignIssue?.message || 'Failed to assign issue');
      }
      setIsAssigning(false);
    },
    onError: (error) => {
      showError(error.message || 'Failed to assign issue');
    },
  });

  const [removeAssignee, { loading:removeAssigneeLoading }] = useMutation(REMOVE_ASSIGNEE, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.removeAssineeOfIssue?.success) {
        showSuccess('Issues Unassigned');
        handleClose();
      } else {
        showError(data?.removeAssineeOfIssue?.message || 'Failed to assign issue');
      }
      setIsAssigning(false);
    },
    onError: (error) => {
      showError(error.message || 'Failed to remove Assignee');
    },
  });

  const members = data?.getProjectTeamsMembers || [];

  // Filter members based on search term
  const filteredMembers = members.filter((member: any) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const email = member.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleMemberClick = useCallback(
    (memberId: string) => {
      if (memberId === selectedMemberId) {
        // if clicking the current assignee, show a message
        showError('This issue is already assigned to this member');
        return;
      }
      setSelectedMemberId(memberId);
    },
    [currentAssigneeId]
  );

  const handleClose = useCallback(() => {
    setMemberTab(false);
    setSearchTerm('');
    setSelectedMemberId(null);
  }, [setMemberTab]);

  const handleUnassign = useCallback(async () => {
    setIsAssigning(true);

    try {
      await removeAssignee({
        variables: {
          issueId: issueId
        },
      });

      showSuccess('Issue unassigned successfully');
      onAssignmentChange?.('', 'Unassigned');
      handleClose();
    } catch (error) {
      showError('Failed to unassign issue');
    } finally {
      setIsAssigning(false);
    }
  }, [changeAssignee, projectId, issueId, onAssignmentChange, handleClose]);

  const handleAssignConfirm = useCallback(async () => {
    if (!selectedMemberId) return;

    setIsAssigning(true);

    try {
      await changeAssignee({
        variables: {
          input: {
            assigneeId: selectedMemberId,
            projectId,
            issueId,
          },
        },
      });
    } catch (error) {
      console.error('Assignment error:', error);
      setIsAssigning(false);
    }
  }, [selectedMemberId, changeAssignee, projectId, issueId]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  // Focus search input on mount
  useEffect(() => {
    const searchInput = document.querySelector(
      'input[placeholder="Search members..."]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  if (loading  || removeAssigneeLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
          <LoadingState size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Team Member
              </h3>
              <p className="text-xs text-gray-500">
                Choose a team member to assign this issue to
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>

          {searchTerm && (
            <div className="mt-2 text-xs text-gray-500">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Current Assignee Info */}
        {currentAssigneeId && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-xs font-medium text-blue-900">
                    Currently Assigned
                  </span>
                  {(() => {
                    const currentAssignee = members.find(
                      (m: any) => m.id === currentAssigneeId
                    );
                    return (
                      currentAssignee && (
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar
                            name={currentAssignee.firstName}
                            src={currentAssignee.avatar}
                          />
                          <span className="text-xs text-blue-800">
                            {currentAssignee.firstName}{' '}
                            {currentAssignee.lastName}
                          </span>
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={handleUnassign}
                disabled={isAssigning}
                className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Unassign
              </button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 overflow-y-auto max-h-80">
          {error ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Failed to load team members
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                {error.message ||
                  'An error occurred while fetching team members'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-6 text-center">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-base font-medium text-gray-900 mb-2">
                {searchTerm ? 'No members found' : 'No team members'}
              </h4>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? `No members match "${searchTerm}". Try a different search term.`
                  : "This project doesn't have any team members yet."}
              </p>
            </div>
          ) : (
            <div className="p-3">
              <Members
                members={filteredMembers}
                handleClick={handleMemberClick}
                loading={false}
                error=""
                searchTerm=""
                onSearchChange={() => {}}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedMemberId && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const selectedMember = members.find(
                    (m: any) => m.id === selectedMemberId
                  );
                  return (
                    selectedMember && (
                      <>
                        <Avatar
                          name={selectedMember.firstName}
                          src={selectedMember.avatar}
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {selectedMember.firstName} {selectedMember.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedMember.email}
                          </div>
                        </div>
                      </>
                    )
                  );
                })()}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMemberId(null)}
                    className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    disabled={isAssigning}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignConfirm}
                    disabled={isAssigning}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {isAssigning ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Assign Issue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
