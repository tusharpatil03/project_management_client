import { useQuery } from '@apollo/client';
import { GET_ISSUE_BY_ID } from '../../graphql/Query/issue';
import Avatar from '../Profile/Avatar';
import Loader from '../Loader';
import { InterfaceIssue } from '../../types/types';

interface ChildProps {
  issueId: string;
  setIssueTab: (value: boolean) => void;
  onIssueUpdates?: ()=> void
}
const IssueDetails: React.FC<ChildProps> = ({ issueId, setIssueTab }) => {
  const { loading, error, data } = useQuery(GET_ISSUE_BY_ID, {
    variables: { issueId },
  });

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="sm" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-red-50 text-red-700 rounded-lg shadow">
        <p className="font-medium">Oops! Couldn’t load this issue.</p>
        <p className="mt-2 text-sm">{error.message}</p>
        <button
          onClick={() => setIssueTab(false)}
          className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const issue:InterfaceIssue = data?.getIssueById;
  if (!issue) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-100 text-gray-700 rounded-lg shadow">
        <p className="italic">Issue not found.</p>
        <button
          onClick={() => setIssueTab(false)}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Close Button */}
      <button
        onClick={() => setIssueTab(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl"
        aria-label="Close details"
      >
        x
      </button>

      {/* Title & Meta */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">{issue.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>
            <strong>Status:</strong> {issue.status}
          </span>
          <span>
            <strong>Due:</strong>{' '}
            {issue.dueDate
              ? new Date(issue.dueDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '—'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {issue.description || 'No description provided.'}
        </p>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Assignee */}
        <div className="flex items-center gap-3">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Assignee</h4>
            <div className="flex items-center gap-2 mt-1">
              {issue.assignee ? (
                <div>
                  <Avatar
                    name={`${issue.assignee.firstName} ${issue.assignee.lastName}`}
                    src={issue.assignee.profile.avatar}
                    size={36}
                  />
                  <span className="text-gray-800">
                    {issue.assignee.firstName} {issue.assignee.lastName}
                  </span>
                </div>
              ) : (
                <p>Unassigned</p>
              )}
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Created By</h4>
            <div className="flex items-center gap-2 mt-1">
              <Avatar
                name={`${issue.creator.firstName} ${issue.creator.lastName}`}
                src={issue.creator.profile.avatar}
                size={36}
              />
              <span className="text-gray-800">
                {issue.creator.firstName} {issue.creator.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const IssueDetails: React.FC<ChildProps> = (props) => {
//   return (
//     <ErrorBoundary
//       fallback={
//         <div className="p-4 bg-white rounded-lg shadow">
//           <h3 className="text-red-600">Failed to load issue details</h3>
//           <button
//             onClick={() => props.setIssueTab(false)}
//             className="mt-2 px-4 py-2 bg-gray-200 rounded"
//           >
//             Close
//           </button>
//         </div>
//       }
//     >
//       <IssueDetailsContent {...props} />
//     </ErrorBoundary>
//   );
// };

export default IssueDetails;
