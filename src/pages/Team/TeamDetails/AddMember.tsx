import React, { useState } from 'react';
import MemberSearch from '../../User/GetUserBySearch';
import { useMessage } from '../../../components/ShowMessage';
import { useMutation } from '@apollo/client';
import { ADD_TEAM_MEMBER } from '../../../graphql/Mutation/team';
import { useDashboard } from '../../Dashboard/DashBoard';

interface AddTeamMemberProps {
  setAddMemberTab: (value: boolean) => void;
  teamId: string;
  onSuccess?: () => void;
}

const AddTeamMember: React.FC<AddTeamMemberProps> = ({
  setAddMemberTab,
  teamId,
  onSuccess,
}) => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>('Contributor');
  const { currentProject } = useDashboard();
  const { showSuccess, showError } = useMessage();

  const [addTeamMember, { loading: adding }] = useMutation(ADD_TEAM_MEMBER, {
    onError(err) {
      showError(err.message);
    },
    onCompleted: () => {
      showSuccess('Member added successfully!');
      setSelectedMember(null);
      setSelectedRole('Contributor');
      setAddMemberTab(false);
      onSuccess?.();
    },
  });

  const handleAddTeamMember = () => {
    if (!selectedMember) return;

    addTeamMember({
      variables: {
        input: {
          memberId: selectedMember.id || selectedMember,
          teamId: teamId,
          projectId: currentProject?.id,
          role: selectedRole,
        },
      },
    });
  };

  const handleCancel = () => {
    setSelectedMember(null);
    setSelectedRole('Contributor');
    setAddMemberTab(false);
  };

  const handleMemberSelect = (member: any) => {
    console.log('selected member:', member);
    setSelectedMember(member);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Team Member
                </h2>
                <p className="text-sm text-gray-500">
                  Search and invite a member
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[calc(80vh-180px)] overflow-y-auto">
          {/* Search Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Member
            </label>
            <MemberSearch setUser={handleMemberSelect} />
          </div>

          {/* Selected Member Display */}
          {selectedMember ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    {selectedMember.firstName?.[0]}
                    {selectedMember.lastName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </h3>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">
                        Selected
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {selectedMember.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                  title="Clear selection"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-6 text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-sm text-gray-600 font-medium">
                No member selected
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Use the search above to select
              </p>
            </div>
          )}

          {/* Role Selection */}
          {selectedMember && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Admin', 'Contributor', 'Viewer'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`relative px-3 py-2 rounded-lg border transition-all ${
                      selectedRole === role
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {selectedRole === role && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          role === 'Admin'
                            ? 'bg-red-50 text-red-600'
                            : role === 'Contributor'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {role === 'Admin' && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {role === 'Contributor' && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )}
                        {role === 'Viewer' && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          selectedRole === role
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                <svg
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Admins have full control, Contributors can edit, and Viewers have read-only access
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTeamMember}
            disabled={adding || !selectedMember}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
              adding || !selectedMember
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {adding ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </>
            ) : (
              <>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMember;
