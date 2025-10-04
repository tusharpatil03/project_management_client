import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { Search, Users, X } from 'lucide-react';
import { useState } from 'react';
import { InterfaceUser } from '../../../../types/types';
import { showError } from '../../../../utils/showError';
import { GET_ALL_MEMBERS } from '../../../../graphql/Query/team';
import { ASSIGN_ISSUE, REMOVE_ASSIGNEE } from '../../../../graphql/Mutation/issue';
import Members from '../../../../components/Team/Members';
import Avatar from '../../../../components/Profile/Avatar';
import LoadingState from '../../../../components/LoadingState';
import { useMessage } from '../../../../components/ShowMessage';

interface AssignMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  currentAssignee?: InterfaceUser | null;
  onAssignSuccess: () => void;
}

export const AssignMemberModal = ({
  isOpen,
  onClose,
  issueId,
  currentAssignee,
  onAssignSuccess,
}: AssignMemberModalProps) => {
  const { showMessage } = useMessage();
  const [searchQuery, setSearchQuery] = useState('');

  const { loading, data } = useQuery(GET_ALL_MEMBERS, {
    variables: { teamId: issueId },
  });

  const [assignIssue] = useMutation(ASSIGN_ISSUE, {
    onCompleted: () => {
      showMessage('Issue assigned successfully', 'success');
      onAssignSuccess();
      onClose();
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const [removeAssignee] = useMutation(REMOVE_ASSIGNEE, {
    onCompleted: () => {
      showMessage('Assignee removed successfully', 'success');
      onAssignSuccess();
      onClose();
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleAssign = async (userId: string) => {
    await assignIssue({
      variables: {
        issueId,
        userId,
      },
    });
  };

  const handleRemoveAssignee = async () => {
    await removeAssignee({
      variables: {
        issueId,
      },
    });
  };

  const filteredMembers = data?.getAllMembers.filter((member: InterfaceUser) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Assign Member</h2>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {loading ? (
          <LoadingState size="lg" />
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {currentAssignee && (
              <div className="mb-4 border-b pb-4">
                <p className="mb-2 text-sm text-gray-500">Current Assignee</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar firstName={currentAssignee.firstName} lastName={currentAssignee.lastName} email={currentAssignee.email} size="medium" />
                    <span className="font-medium">{`${currentAssignee.firstName} ${currentAssignee.lastName}`}</span>
                  </div>
                  <button
                    onClick={handleRemoveAssignee}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            <Members
              members={filteredMembers}
              handleClick={handleAssign}
              loading={loading}
              error={undefined}
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};
