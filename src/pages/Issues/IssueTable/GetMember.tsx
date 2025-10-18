import { AlertCircle, CheckCircle, Search, Users, X } from 'lucide-react';
import Avatar from '../../../components/Profile/Avatar';
import Members from '../../../components/Team/Members';
import LoadingState from '../../../components/LoadingState';
import { useCallback, useEffect, useState } from 'react';
import { useMessage } from '../../../components/ShowMessage';
import { useProjectMembers } from '../../../hooks/ProjectMember';
import { UserTeam } from '../../../types';
import { useRemoveAssignee, useAssignee } from '../../../hooks/AssigneIssue';

interface GetMembersProps {
  projectId: string;
  issueId: string;
  setMemberTab: (value: boolean) => void;
  currentAssigneeId?: string;
  onAssignmentChange?: Function;
}

const GetMembers: React.FC<GetMembersProps> = ({
  projectId,
  issueId,
  setMemberTab,
  currentAssigneeId,
  onAssignmentChange,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const { showSuccess, showError } = useMessage();

  const {
    members,
    filteredMembers,
    loading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
  } = useProjectMembers();

  const { changeAssignee, assignError, assignLoading } = useAssignee();

  const { removeAssignee, removeAssigneErr, removeAssigneeLoad } =
    useRemoveAssignee();

  const handleMemberClick = useCallback(
    (memberId: string) => {
      // toggle off when clicking the already-selected member
      if (memberId === selectedMemberId) {
        setSelectedMemberId(null);
        return;
      }

      // prevent selecting the current assignee for assignment (use Unassign button instead)
      if (memberId === currentAssigneeId) {
        showError('This issue is already assigned to this member');
        return;
      }

      setSelectedMemberId(memberId);
    },
    [currentAssigneeId, selectedMemberId, showError]
  );

  const handleClose = useCallback(() => {
    setMemberTab(false);
    setSearchTerm('');
    setSelectedMemberId(null);
  }, [setMemberTab]);

  const handleUnassign = useCallback(async () => {
    setIsAssigning(true);
    try {
      // onCompleted of the mutation will handle UI updates and parent notification
      await removeAssignee({
        variables: { issueId },
        onCompleted: (data) => {
          if (data?.removeAssineeOfIssue?.success) {
            showSuccess('Issues Unassigned');
            handleClose();
          } else {
            showError(
              data?.removeAssineeOfIssue?.message || 'Failed to assign issue'
            );
          }
          setIsAssigning(false);
        },
        onError: (error) => {
          showError(error.message || 'Failed to remove Assignee');
        },
      });
    } catch (error) {
      showError('Failed to unassign issue');
      setIsAssigning(false);
    }
  }, [removeAssignee, issueId]);

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

      // Component-specific logic
      const assignedMember = members.find(
        (m: UserTeam) => m.id === selectedMemberId
      );
      const memberName = assignedMember
        ? `${assignedMember.firstName} ${assignedMember.lastName}`
        : 'Unknown';

      showSuccess(`Issue successfully assigned to ${memberName}`);
      onAssignmentChange?.(selectedMemberId, memberName);
      handleClose();
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

  if (loading || removeAssigneeLoad) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <LoadingState size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Assign Team Member
              </h3>
              <p className="text-sm text-gray-500">
                Choose a team member to assign this issue to
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>

          {searchTerm && (
            <div className="mt-2 text-sm text-gray-500">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Current Assignee Info */}
        {currentAssigneeId && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-blue-900">
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
                            name={`${currentAssignee.firstName || ''} ${currentAssignee.lastName || ''}`.trim()}
                            src={currentAssignee.avatar}
                            email={currentAssignee.email}
                          />
                          <span className="text-sm text-blue-800">
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
                className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Unassign
              </button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load team members
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                {error.message ||
                  'An error occurred while fetching team members'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No members found' : 'No team members'}
              </h4>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? `No members match "${searchTerm}". Try a different search term.`
                  : "This project doesn't have any team members yet."}
              </p>
            </div>
          ) : (
            <div className="p-4">
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
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                          <div className="font-medium text-gray-900">
                            {selectedMember.firstName} {selectedMember.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedMember.email}
                          </div>
                        </div>
                      </>
                    )
                  );
                })()}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMemberId(null)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isAssigning}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignConfirm}
                    disabled={isAssigning}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAssigning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
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

export default GetMembers;
