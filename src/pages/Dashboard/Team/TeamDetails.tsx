import { useMutation, useQuery } from '@apollo/client';
import { GET_TEAM_BY_ID } from '../../../graphql/Query/team';
import { showError } from '../../../utils/showError';
import { useParams, useNavigate } from 'react-router-dom';
import { InterfaceUser } from '../../../types/types';
import LoadingState from '../../../components/LoadingState';
import MemberSearch from '../User/GetUserBySearch';
import { ADD_TEAM_MEMBER } from '../../../graphql/Mutation/team';
import { MemberCard, TabButton } from './Components';
import { useState } from 'react';

interface InterfaceTeam {
  id: string;
  name: string;
  creatorId: string;
  users?: {
    id: string;
    role?: string;
    userId?: string;
    teamId?: string;
    user?: InterfaceUser;
  }[];
}

export const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>(
    'overview'
  );

  const [addMemberTab, setAddMemberTab] = useState<boolean>(false);
  const [member, setMember] = useState<string>('');
  const handleSetMember = (id: string) => {
    setMember(id);
  };

  const { data, error, loading } = useQuery<{ getTeamById: InterfaceTeam }>(
    GET_TEAM_BY_ID,
    {
      variables: { teamId: teamId },
    }
  );

  // useMutation returns a loading state; handle errors centrally via onError
  const [addTeamMember, { loading: adding }] = useMutation(ADD_TEAM_MEMBER, {
    onError(err) {
      showError(err.message);
    },
  });

  const handleAddTeamMember = async () => {
    if (!member || !data?.getTeamById) return;
    const team = data.getTeamById;
    // Prevent adding if already a member
    const alreadyMember =
      team.users?.some((u) => u.userId === member || u.user?.id === member) ||
      false;
    if (alreadyMember) {
      showError('User is already a member of this team');
      return;
    }

    try {
      await addTeamMember({
        variables: {
          input: {
            memberId: member,
            teamId: team.id,
            role: "Admin"
          },
        },
        // Refresh the team query so UI stays consistent
        refetchQueries: [
          {
            query: GET_TEAM_BY_ID,
            variables: { teamId: teamId },
          },
        ],
        awaitRefetchQueries: true,
      });
      // success: close the add panel and clear selection
      setAddMemberTab(false);
      setMember('');
    } catch (err) {
      // onError above already shows error; this is defensive
    }
  };

  if (error) {
    showError(error.message);
  }

  if (loading) {
    return <LoadingState size="lg" />;
  }

  if (!data?.getTeamById) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-600">Team not found</h2>
        <button
          onClick={() => navigate('/teams')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Teams
        </button>
      </div>
    );
  }

  const team = data.getTeamById;

  const getTeamStats = () => {
    const users = team.users || [];
    return {
      total: users.length,
      admins: users.filter((u) => u.role?.toLowerCase() === 'admin').length,
      contributors: users.filter((u) => u.role?.toLowerCase() === 'contributor')
        .length,
      viewers: users.filter((u) => u.role?.toLowerCase() === 'viewer').length,
    };
  };

  const creator = team.users?.find((u) => u.user?.id === team.creatorId);
  const otherMembers =
    team.users?.filter((u) => u.user?.id !== team.creatorId) || [];
  const stats = getTeamStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {/* Add member panel */}
      {addMemberTab && (
        <div className="z-10 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <MemberSearch setUser={handleSetMember} />
              {/* show selected id (MemberSearch currently provides id) */}
              {member ? (
                <div className="mt-2 text-sm text-gray-700">
                  Selected member id: <span className="font-medium">{member}</span>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500">
                  Search and pick a user to add to the team.
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTeamMember}
                disabled={adding || !member}
                className={`px-4 py-2 rounded text-white ${
                  adding || !member ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {adding ? 'Adding…' : 'Add member'}
              </button>
              <button
                onClick={() => {
                  setAddMemberTab(false);
                  setMember('');
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate('/people/teams')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Teams
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            </div>

            <button onClick={() => setAddMemberTab((prev) => !prev)}>
              Add member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-blue-800">Total Members</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats.admins}
              </div>
              <div className="text-sm text-red-800">Admins</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.contributors}
              </div>
              <div className="text-sm text-green-800">Contributors</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {stats.viewers}
              </div>
              <div className="text-sm text-gray-800">Viewers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <TabButton
            tab="overview"
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            tab="members"
            label="Members"
            isActive={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>

            {/* Creator Section */}
            {creator && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Team Creator
                </h3>
                <MemberCard teamUser={creator} isCreator={true} />
              </div>
            )}

            {/* Recent Members */}
            {otherMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Recent Team Members
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {otherMembers.slice(0, 4).map((member) => (
                    <MemberCard key={member.id} teamUser={member} />
                  ))}
                </div>
                {otherMembers.length > 4 && (
                  <button
                    onClick={() => setActiveTab('members')}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {otherMembers.length} members →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Team Members</h2>

            {/* Creator First */}
            {creator && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Team Creator
                </h3>
                <MemberCard teamUser={creator} isCreator={true} />
              </div>
            )}

            {/* Other Members */}
            {otherMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Team Members ({otherMembers.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {otherMembers.map((member) => (
                    <MemberCard key={member.id} teamUser={member} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
