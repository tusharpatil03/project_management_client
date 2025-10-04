import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_ISSUE_BY_ID } from '../../../graphql/Query/issue';
import { InterfaceIssue } from '../../../types/types';
import { useDashboard } from '../../Dashboard/DashBoard';
import EditIssue from '../EditIssue/EditIssue';
import {
  LoadingState,
  ErrorState,
  IssueHeader,
  IssueStatus,
  IssueDescription,
  IssuePeople,
  IssueTimeline,
  IssueFooter,
} from './components';

interface ChildProps {
  issueId: string;
  setIssueTab: (value: boolean) => void;
  onIssueUpdates: () => void;
}

const IssueDetails: React.FC<ChildProps> = ({
  issueId,
  setIssueTab,
  onIssueUpdates,
}) => {
  const { currentProject } = useDashboard();
  const [isClosing, setIsClosing] = useState(false);
  const [editIssue, setEditIssue] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ISSUE_BY_ID, {
    variables: { issueId, projectId: currentProject?.id },
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIssueTab(false);
      setIsClosing(false);
    }, 200);
  };

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={refetch} 
        onClose={handleClose} 
      />
    );
  }

  const issue: InterfaceIssue = data?.getIssueById;
  if (!issue) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Issue Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              The issue you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

    const toggleEdit = ()=> {
      setEditIssue(!editIssue);
    }

    console.log("Assignee:",issue.assignee);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      {editIssue && (
        <EditIssue
          issue={issue}
          toggleTab={toggleEdit}
          onIssueUpdated={onIssueUpdates}
          projectId={currentProject?.id || ''}
        />
      )}
      <div
        className={`relative w-full max-w-3xl bg-white rounded-xl shadow-2xl my-8 transition-transform duration-200 ${isClosing ? 'scale-95' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IssueHeader issueId={issue.id} onClose={handleClose} />

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {issue.title}
            </h1>
            <IssueStatus 
              status={issue.status} 
              dueDate={issue.dueDate ? issue.dueDate?.toLocaleString() : undefined} 
            />
          </div>

          <IssueDescription 
            description={issue.description || null} 
          />
          
          <IssuePeople 
            assignee={issue.assignee || null} 
            creator={issue.creator} 
          />

          <IssueTimeline 
            createdAt={issue.createdAt.toLocaleString()}
            updatedAt={issue.updatedAt.toLocaleString()}
          />
        </div>

        <IssueFooter 
          onClose={handleClose}
          onEdit={toggleEdit}
        />
      </div>
    </div>
  );
};

export default IssueDetails;
