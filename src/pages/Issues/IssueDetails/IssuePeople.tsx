import React from 'react';
import Avatar from '../../../components/Profile/Avatar';
import { InterfaceUser } from '../../../types';

interface IssuePeopleProps {
  assignee: InterfaceUser | null;
  creator: InterfaceUser;
}

export const IssuePeople: React.FC<IssuePeopleProps> = ({ assignee, creator }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Assignee */}
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
        Assigned To
      </h4>
      {assignee ? (
        <div className="flex items-center gap-3">
          <Avatar
            firstName={assignee.firstName}
            lastName={assignee.lastName}
            src={assignee.profile?.avatar || ''}
            size={40}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {assignee.firstName} {assignee.lastName}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {assignee.email}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-sm italic">Unassigned</span>
        </div>
      )}
    </div>

    {/* Creator */}
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
        Created By
      </h4>
      <div className="flex items-center gap-3">
        <Avatar
          firstName={creator.firstName}
          lastName={creator.lastName}
          src={creator.profile?.avatar || ''}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {creator.firstName} {creator.lastName}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {creator.email}
          </p>
        </div>
      </div>
    </div>
  </div>
);