import { MemberCard } from '../Team';
import { UserTeam } from '../../../types';
import { memo } from 'react';

const OverviewTab = memo(({
  creator,
  recentMembers,
  stats,
  onViewAllMembers,
}: {
  creator: UserTeam;
  recentMembers: UserTeam[];
  stats: any;
  onViewAllMembers: () => void;
}) => {
  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team Creator Section */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Team Creator
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-medium text-base flex-shrink-0">
                {creator?.user.firstName[0]}
                {creator?.user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">
                  {creator?.user.firstName} {creator?.user.lastName}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {creator?.user.email}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                  Team Creator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Team Composition
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-500">Members</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats.admins}
              </div>
              <div className="text-sm text-gray-500">Admins</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats.contributors}
              </div>
              <div className="text-sm text-gray-500">Contributors</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stats.viewers}
              </div>
              <div className="text-sm text-gray-500">Viewers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Members */}
      {recentMembers.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Members
            </h2>
            <button
              onClick={onViewAllMembers}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recentMembers.map((member) => (
              <MemberCard
                key={member.id}
                teamUser={member}
                isCreator={false}
                isCurrentUser={false}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';
export default OverviewTab;
