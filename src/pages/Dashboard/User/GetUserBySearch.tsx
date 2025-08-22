import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USERS_BY_SEARCH } from '../../../graphql/Query/user';

interface SearchUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    id: string;
    avatar: string;
  };
}

interface UserSearchProps {
  setUser: (userId: string) => void;
  placeholder?: string;
  maxResults?: number;
}

const MemberSearch: React.FC<UserSearchProps> = ({
  setUser,
  placeholder = 'Search for users...',
  maxResults = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [searchUsers, { data, loading, error }] = useLazyQuery<{
    getUsersBySearch: SearchUser[];
  }>(GET_USERS_BY_SEARCH, {
    onCompleted: () => {
      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false);
    },
  });

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      searchUsers({
        variables: { search: searchTerm.trim() },
      });
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers]);

  const handleUserSelect = (userId: string) => {
    setUser(userId);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setIsSearching(false);
  };

  const users = data?.getUsersBySearch?.slice(0, maxResults) || [];

  return (
    <div className="relative w-full max-w-md">
      {/* Search Card Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Search Input Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isSearching ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="max-h-80 overflow-y-auto">
            {loading || isSearching ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <div className="text-red-500 text-sm flex items-center justify-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Error searching users
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center">
                <div className="text-gray-500 text-sm flex items-center justify-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No users found
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
                  >
                    <div className="flex items-center space-x-3">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {user.profile?.avatar ? (
                          <img
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                            src={user.profile.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-200">
                            <span className="text-xs font-medium text-white">
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Select Icon */}
                      <div className="flex-shrink-0">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Instructions */}
        {!showResults && !searchTerm && (
          <div className="p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Type at least 2 characters to search for users
            </p>
          </div>
        )}
      </div>

      {/* Results Counter */}
      {showResults && users.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Showing {users.length} result{users.length !== 1 ? 's' : ''}
          {data?.getUsersBySearch &&
            data.getUsersBySearch.length > maxResults &&
            ` (${data.getUsersBySearch.length - maxResults} more available)`}
        </div>
      )}
    </div>
  );
};

export default MemberSearch;
