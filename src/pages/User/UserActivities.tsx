import React from 'react';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

// Define the shape of a single activity.
// It's a good practice to import this from your main types file.
interface Activity {
  id: string;
  action: string | null;
  createdAt: string;
  project: { key: string; name: string | null } | null;
  issue: { key: string; title: string | null } | null;
}

// Props for the component
interface UserActivitiesProps {
  activities: Activity[] | null | undefined;
  maxItems?: number; // optional limit for how many activities to show
}

/** Utility to format date consistently */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Decide an icon based on the activity action */
function getActivityIcon(action: string | null): React.ReactNode {
  if (!action) return <FileText className="w-5 h-5 text-gray-400" />;
  if (action.toLowerCase().includes('created'))
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (action.toLowerCase().includes('updated'))
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  return <FileText className="w-5 h-5 text-blue-500" />;
}

const UserActivities: React.FC<UserActivitiesProps> = ({
  activities,
  maxItems = 5,
}) => {
  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        Recent Activities
      </h2>

      {activities && activities.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {activities.slice(0, maxItems).map((activity) => (
            <li key={activity.id} className="py-4">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getActivityIcon(activity.action)}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800">
                    {activity.action ?? 'Did something'}
                    {activity.project && (
                      <>
                        {' '}
                        in project{' '}
                        <a
                          href={`/projects/${activity.project.key}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {activity.project.name ?? activity.project.key}
                        </a>
                      </>
                    )}
                    {activity.issue && (
                      <>
                        :{' '}
                        <a
                          href={`/issues/${activity.issue.key}`}
                          className="font-medium text-gray-600 hover:underline"
                        >
                          “{activity.issue.title ?? activity.issue.key}”
                        </a>
                      </>
                    )}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No recent activities yet. Once you start creating or updating issues
            and projects, they’ll show up here.
          </p>
        </div>
      )}
    </section>
  );
};

export default UserActivities;
