import { InterfaceUser } from '../../../types/types';
import { getRoleBadgeColor } from './helper';

interface InterfaceUserTeam {
  id: string;
  role?: string;
  userId?: string;
  teamId?: string;
  user?: InterfaceUser;
}

export const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  tab?: string;
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

export const MemberCard = ({
  teamUser,
  isCreator = false,
}: {
  teamUser: InterfaceUserTeam;
  isCreator?: boolean;
}) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
        isCreator
          ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          {false ? (
            <img
              className={`w-12 h-12 rounded-full object-cover ${isCreator ? 'ring-4 ring-purple-200' : 'ring-2 ring-gray-200'}`}
              src={teamUser.user?.profile?.avatar || ''}
              alt={`${teamUser.user?.firstName} ${teamUser.user?.lastName}`}
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
};
