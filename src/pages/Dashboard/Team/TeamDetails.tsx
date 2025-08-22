import { useQuery } from '@apollo/client';
import { GET_TEAM_BY_ID } from '../../../graphql/Query/team';
import { showError } from '../../../utils/showError';
import { useParams, useNavigate } from 'react-router-dom';
import { InterfaceUser } from '../../../types/types';
import LoadingState from '../../../components/LoadingState';
import { useState } from 'react';
import { UserSearch } from 'lucide-react';
import MemberSearch from '../User/GetUserBySearch';

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

  const getRoleBadgeColor = (role: string, isCreator: boolean = false) => {
    if (isCreator) {
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500';
    }
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'contributor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string, isCreator: boolean = false) => {
    if (isCreator) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.383-1.814-.528-2.516zM21 12.543a41.136 41.136 0 00-.39-3.114 29.777 29.777 0 00-7.88 4.031 7.5 7.5 0 012.73 7.287 41.066 41.066 0 005.54-8.204zm-4.777 7.901a9.007 9.007 0 01-3.223-5.444 31.007 31.007 0 01-3.678-1.817 31.007 31.007 0 01-3.678 1.817 9.007 9.007 0 01-3.223 5.444A39.556 39.556 0 0010 22.139a39.556 39.556 0 007.223-1.695z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'contributor':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      case 'viewer':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

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

  const TabButton = ({
    tab,
    label,
    isActive,
    onClick,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {label}
    </button>
  );

  const MemberCard = ({
    teamUser,
    isCreator = false,
  }: {
    teamUser: any;
    isCreator?: boolean;
  }) => (
    <div
      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
        isCreator
          ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          {teamUser.user?.profile?.avatar ? (
            <img
              className={`w-12 h-12 rounded-full object-cover ${isCreator ? 'ring-4 ring-purple-200' : 'ring-2 ring-gray-200'}`}
              src={teamUser.user.profile.avatar}
              alt={`${teamUser.user.firstName} ${teamUser.user.lastName}`}
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                isCreator
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 ring-4 ring-purple-200'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 ring-2 ring-gray-200'
              }`}
            >
              {teamUser.user?.firstName?.[0]}
              {teamUser.user?.lastName?.[0]}
            </div>
          )}
          {isCreator && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-yellow-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3
              className={`font-semibold truncate ${isCreator ? 'text-purple-900' : 'text-gray-900'}`}
            >
              {teamUser.user?.firstName} {teamUser.user?.lastName}
              {isCreator && (
                <span className="ml-2 text-xs font-normal text-purple-600">
                  (Creator)
                </span>
              )}
            </h3>
          </div>
          <p
            className={`text-sm truncate ${isCreator ? 'text-purple-700' : 'text-gray-600'}`}
          >
            {teamUser.user?.email}
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(teamUser.role || '', isCreator)}`}
            >
              {getRoleIcon(teamUser.role || '', isCreator)}
              <span className="ml-1">{teamUser.role}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {addMemberTab ? (
        <div className="z-10">
          <MemberSearch setUser={handleSetMember} />
        </div>
      ) : <></>}
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

//  const [
//     addTeamMember,
//     { loading: addTeamMemberLoading, error: addTeamMemberError },
//   ] = useMutation(ADD_TEAM_MEMBER, {
//     onCompleted(data) {
//       data?.getTeamById.users?.push(data.addTeamMember);
//     },
//     onError(err) {
//       showError(err.message);
//     },
//   });
//    if (error && addTeamMemberError) {
//     showError(error.message);
//   }

export default TeamDetails;
