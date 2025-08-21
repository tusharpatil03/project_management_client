import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_TEAMS } from '../../../graphql/Query/team';
import { showError } from '../../../utils/showError';
import LoadingState from '../../../components/LoadingState';
import { InterfaceUser } from '../../../types/types';

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

const TeamBoard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const { data, error } = useQuery(GET_ALL_TEAMS, {
    nextFetchPolicy: 'cache-first',
    onCompleted() {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
  });

  if (error) {
    showError('Unable to fetch server');
  }

  if (loading) {
    return <LoadingState size="lg" />;
  }

  const getRoleBadgeColor = (role: string) => {
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

  const getCurrentUserRole = (team: InterfaceTeam): string => {
    // This would need the current user's ID from context/auth
    // For now, assuming you have access to current user ID
    const currentUserId = 'current_user_id'; // Replace with actual current user ID
    const userInTeam = team.users?.find(u => u.user?.id === currentUserId);
    return userInTeam?.role || 'Unknown';
  };

  const getDisplayUsers = (users: InterfaceTeam['users'] = [], maxDisplay: number = 3) => {
    return users.slice(0, maxDisplay);
  };

  const getTeamStats = (team: InterfaceTeam) => {
    const totalUsers = team.users?.length || 0;
    const adminCount = team.users?.filter(u => u.role?.toLowerCase() === 'admin').length || 0;
    const contributorCount = team.users?.filter(u => u.role?.toLowerCase() === 'contributor').length || 0;
    const viewerCount = team.users?.filter(u => u.role?.toLowerCase() === 'viewer').length || 0;

    return {
      total: totalUsers,
      admins: adminCount,
      contributors: contributorCount,
      viewers: viewerCount
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Team Board</h1>
        <p className="text-gray-600">Manage and view all teams you're part of</p>
      </div>

      {!data?.getAllTeams?.length ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-500">You haven't joined or created any teams yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.getAllTeams?.map((team: InterfaceTeam) => {
            const stats = getTeamStats(team);
            const displayUsers = getDisplayUsers(team.users);
            const remainingCount = (team.users?.length || 0) - displayUsers.length;
            const currentUserRole = getCurrentUserRole(team);

            return (
              <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate" title={team.name}>
                        {team.name}
                      </h3>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(currentUserRole)}`}>
                          Your Role: {currentUserRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        {stats.total} members
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stats.admins > 0 && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          {stats.admins} Admin{stats.admins > 1 ? 's' : ''}
                        </span>
                      )}
                      {stats.contributors > 0 && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {stats.contributors} Contributor{stats.contributors > 1 ? 's' : ''}
                        </span>
                      )}
                      {stats.viewers > 0 && (
                        <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {stats.viewers} Viewer{stats.viewers > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* User Avatars */}
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {displayUsers.map((teamUser, index) => (
                          <div
                            key={teamUser.id}
                            className="relative inline-block"
                            title={`${teamUser.user?.firstName} ${teamUser.user?.lastName} (${teamUser.role})`}
                          >
                            {teamUser.user?.profile?.avatar ? (
                              <img
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                src={teamUser.user.profile.avatar}
                                alt={`${teamUser.user.firstName} ${teamUser.user.lastName}`}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {teamUser.user?.firstName?.[0]}{teamUser.user?.lastName?.[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {remainingCount > 0 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{remainingCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/people/${team.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Team
                    </button>
                    <button
                      onClick={() => navigate(`/teams/${team.id}/settings`)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                      title="Team Settings"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamBoard;