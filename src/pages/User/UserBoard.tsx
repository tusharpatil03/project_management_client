import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../graphql/Query/user';
import { Gender, InterfaceUser } from '../../types/types';
import { useDashboard } from '../Dashboard/DashBoard';
import UserProfileHeader from './UserProfileHeader';
import UserAbout from './UserAbout';
import UserActivities from './UserActivities';
import UserProjects from './UserProjects';
import UpdateProfile from './UpdateProfile/UpdateProfile';
import ErrorState from '../../components/ErrorState';
import { useMessage } from '../../components/ShowMessage';
import Loader from '../../components/Loader';

// Type definitions
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  profile?: {
    bio?: string | null;
    phone?: string | null;
    gender?: Gender;
    avatar?: string | null;
    social?: {
      github?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    };
  };
  activities?: any[];
  projects?: any[];
  teams?: any[];
}

interface GetUserByIdResponse {
  getUserById: InterfaceUser;
}

// Utility function to format user data
const formatUserData = (user: InterfaceUser): UserData => ({
  id: user.id,
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  createdAt: new Date(user.createdAt).toISOString(),
  profile: {
    bio: user.profile?.bio ?? null,
    phone: user.profile?.phone ?? null,
    gender: user.profile?.gender ?? Gender.MALE,
    avatar: user.profile?.avatar ?? null,
    social: {
      github: user.profile?.social?.github ?? null,
      linkedin: user.profile?.social?.linkedin ?? null,
      twitter: user.profile?.social?.twitter ?? null,
    },
  },
  activities: user.activities || [],
  projects: user.projects || [],
  teams: user.teams || [],
});

const UserBoard: React.FC = () => {
  const { user: currentUser } = useDashboard();
  const { showSuccess, showError, showInfo } = useMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize authorization check
  const checkAuthorization = useCallback(
    (userId: string) => currentUser?.id === userId,
    [currentUser?.id]
  );

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus,
  } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    variables: { userId: currentUser?.id },
    skip: !currentUser?.id,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    onCompleted: (data) => {
      setIsInitialLoad(false);
      if (data?.getUserById) {
        // showInfo('Profile loaded successfully');
        console.log('Profile loaded successfully');
      }
    },
    onError: (error) => {
      setIsInitialLoad(false);
      // showError(`Failed to load profile: ${error.message}`);
      console.error('Failed to load profile:', error.message);
    },
  });

  // Memoized values
  const isAuthorized = useMemo(
    () => (data?.getUserById ? checkAuthorization(data.getUserById.id) : false),
    [data?.getUserById, checkAuthorization]
  );

  const userData = useMemo(
    () => (data?.getUserById ? formatUserData(data.getUserById) : null),
    [data?.getUserById]
  );

  const isRefetching = networkStatus === 4;

  // Handle edit toggle with message
  const handleEditingToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      // showInfo('Entering edit mode');
      console.log('Entering edit mode');
    }
  }, [isEditing]);

  // Handle refetch with loading state
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
      console.log('Profile refreshed');
    } catch (error) {
      console.error('Failed to refresh profile');
    }
  }, [refetch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && isAuthorized) {
        e.preventDefault();
        handleEditingToggle();
      }
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthorized, isEditing, handleEditingToggle]);

  if (queryLoading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (queryError && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <ErrorState
          title="Failed to Load Profile"
          message={queryError.message || 'An unexpected error occurred'}
          onRetry={handleRefetch}
          showRetry={true}
        />
      </div>
    );
  }

  if (!currentUser?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <ErrorState
          title="Authentication Required"
          message="Please log in to view your profile"
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <ErrorState
          title="User Not Found"
          message="Could not find user information"
          onRetry={handleRefetch}
          showRetry={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Refetching indicator */}
      {isRefetching && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <div className="h-1 bg-blue-600 animate-pulse" />
        </div>
      )}

      {/* Edit mode banner */}
      {isEditing && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium">
          <span>Edit Mode Active</span>
          <span className="ml-2 opacity-75">Press ESC to cancel</span>
        </div>
      )}

      {isEditing ? (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <UpdateProfile
            userData={userData}
            toggleEdit={handleEditingToggle}
            refetch={handleRefetch}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Profile Header with animation */}
          <div className="animate-fadeIn">
            <UserProfileHeader
              user={userData}
              authorized={isAuthorized}
              toggleEdit={handleEditingToggle}
            />
          </div>

          {/* Main Content Grid with staggered animations */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - About & Activities */}
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-slideInLeft">
                <UserAbout
                  profile={userData.profile}
                  email={userData.email}
                  createdAt={userData.createdAt}
                />
              </div>
              <div className="animate-slideInLeft animation-delay-200">
                <UserActivities activities={userData.activities} />
              </div>
            </div>

            {/* Right Column - Projects & Teams */}
            <div className="lg:col-span-1 space-y-6">
              <div className="animate-slideInRight">
                <UserProjects projects={userData.projects} />
              </div>
              {userData.teams && userData.teams.length > 0 && (
                <div className="animate-slideInRight animation-delay-200">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Teams
                    </h3>
                    <div className="space-y-2">
                      {userData.teams.map((team: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-600">
                            {team.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Button for Quick Actions */}
          {isAuthorized && (
            <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
              <button
                onClick={handleRefetch}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow group"
                title="Refresh Profile (Ctrl+R)"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={handleEditingToggle}
                className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
                title="Edit Profile (Ctrl+E)"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserBoard;
