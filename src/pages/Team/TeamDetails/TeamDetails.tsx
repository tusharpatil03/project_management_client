import { useQuery, useMutation } from '@apollo/client';
import { GET_TEAM_BY_ID } from '../../../graphql/Query/team';
import { REMOVE_TEAM_MEMBER } from '../../../graphql/Mutation/team';
import { useParams, useNavigate } from 'react-router-dom';
import { InterfaceUser } from '../../../types/types';
import { useState, useMemo } from 'react';
import OverviewTab from './OverView';
import { useMessage } from '../../../components/ShowMessage';
import AddTeamMember from './AddMember';
import { useDashboard } from '../../Dashboard/DashBoard';
import MembersTab from './Members';
import Loader from '../../../components/Loader';

import { InterfaceTeam, Member, TeamStats } from '../../../types/team';

// Tab Button Component
const TabButton = ({
  label,
  isActive,
  onClick,
  count,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="flex items-center gap-2">
      {label}
      {count !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {count}
        </span>
      )}
    </span>
  </button>
);

const StatsCard = ({
  value,
  label,
  icon,
  color,
  trend,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'purple';
  trend?: string;
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700',
    green:
      'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700',
    purple:
      'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-white/60 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium bg-white/60 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-sm font-semibold opacity-80">{label}</div>
    </div>
  );
};

export const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user, currentProject } = useDashboard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>(
    'overview'
  );
  const [isAddMemberOpen, setIsAddMemberOpen] = useState<boolean>(false);

  const { showError, showSuccess } = useMessage();

  // Query for team data
  const { data, error, loading, refetch } = useQuery<{
    getTeamById: InterfaceTeam;
  }>(GET_TEAM_BY_ID, {
    variables: { teamId },
    skip: !teamId,
    onError: (err) => showError(err.message),
  });

  // Mutation for removing member
  const [removeMemberMutation, { loading: removing }] = useMutation(
    REMOVE_TEAM_MEMBER,
    {
      variables: {
        input: {
          memberId: '',
          teamId: data?.getTeamById.id,
          projectId: currentProject?.id
        }
      },
      onCompleted: () => {
        showSuccess('Member removed successfully');
        refetch();
      },
      onError: (err) => showError(err.message),
    }
  );

  // Memoized calculations
  const teamStats: TeamStats = useMemo(() => {
    const users = data?.getTeamById?.users || [];
    return {
      total: users.length,
      admins: users.filter((u) => u.role?.toLowerCase() === 'admin').length,
      contributors: users.filter((u) => u.role?.toLowerCase() === 'contributor')
        .length,
      viewers: users.filter((u) => u.role?.toLowerCase() === 'viewer').length,
    };
  }, [data?.getTeamById?.users]);

  const { creator, otherMembers } = useMemo(() => {
    const users = data?.getTeamById?.users || [];
    const creatorId = data?.getTeamById?.creatorId;

    return {
      creator: users.find((u) => u.user?.id === creatorId) as Member,
      otherMembers: users.filter((u) => u.user?.id !== creatorId),
    };
  }, [data?.getTeamById]);

  // Handler for removing member
  const handleRemoveMember = async (memberId: string) => {
    if (!teamId) return;

    try {
      await removeMemberMutation({
        variables: {
          input: {
            memberId: memberId,
            teamId: team.id,
            projectId: currentProject?.id,
          },
        },
      });
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  // Handler for adding member
  const handleAddMemberSuccess = () => {
    setIsAddMemberOpen(false);
    refetch();
  };

  // Loading state
  if (loading) {
    return <Loader size="lg" />;
  }

  // Error state
  if (error || !data?.getTeamById) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/20">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-lg w-full border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Team Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The team you're looking for doesn't exist or you don't have access
            to view it.
          </p>
          <button
            onClick={() => navigate('/people/teams')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const team = data.getTeamById;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add Member Modal */}
        {isAddMemberOpen && (
          <AddTeamMember
            setAddMemberTab={setIsAddMemberOpen}
            teamId={team.id}
            onSuccess={handleAddMemberSuccess}
          />
        )}

        {/* Breadcrumb / Back Button */}
        <nav className="mb-6">
          <button
            onClick={() => navigate('/people/teams')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors duration-200 group text-sm font-medium"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Back to Teams</span>
          </button>
        </nav>

        {/* Team Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Team Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
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
              </div>

              {/* Team Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {team.name}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {team.description ||
                    'Manage team members, roles, and permissions'}
                </p>
              </div>
            </div>

            {/* Add Member Button */}
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add Member
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 inline-flex gap-1">
            <TabButton
              label="Overview"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              label="Members"
              count={teamStats.total}
              isActive={activeTab === 'members'}
              onClick={() => setActiveTab('members')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {activeTab === 'overview' && (
            <OverviewTab
              creator={creator}
              recentMembers={otherMembers.slice(0, 3)}
              stats={teamStats}
              onViewAllMembers={() => setActiveTab('members')}
            />
          )}

          {activeTab === 'members' && (
            <MembersTab
              members={otherMembers}
              creator={creator}
              currentUserId={user?.id || ''}
              onRemove={handleRemoveMember}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
