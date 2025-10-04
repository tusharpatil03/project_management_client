import React, { useCallback, useEffect, useState } from 'react';
import { InterfaceIssue, InterfaceProject } from '../../types/types';
import { GET_ALL_ISSUES } from '../../graphql/Query/issue';
import { useQuery } from '@apollo/client';
import Loader from '../../components/Loader';
import IssueTable from './IssueTable/IssuesTable';

interface ChildProps {
  project: InterfaceProject;
}
const IssueBoard: React.FC<ChildProps> = ({ project }) => {
  const [issues, setIssues] = useState<InterfaceIssue[]>([]);
  const [loader, setLoader] = useState(true);

  const projectId = project.id;

  const { error, refetch } = useQuery<{ getAllIssues: InterfaceIssue[] }>(
    GET_ALL_ISSUES,
    {
      variables: { projectId },
      skip: true,
    }
  );

  const fetchIssues = useCallback(async () => {
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const res = await refetch();
      const allIssues = res.data.getAllIssues || [];

      await Promise.all([delay]);
      if (allIssues.length > 0) {
        setIssues(allIssues);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoader(false);
    }
  }, [refetch]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  if (loader)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader size="lg" />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">Failed to load issues.</div>
    );

  return (
    <div>
      <IssueTable issues={issues} projectId={projectId} onIssueUpdate={refetch}/>
    </div>
  );
};
export default IssueBoard;

import { useOutletContext } from 'react-router-dom';

interface ProjectContextType {
  project: InterfaceProject;
  refetch: () => void;
  onCreateSuccess: () => void;
}

export const ProjectIssues: React.FC = () => {
  const { project } = useOutletContext<ProjectContextType>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Issues</h2>
          <p className="text-gray-600 mt-1">Track and manage project issues</p>
        </div>
      </div>

      {/* Your existing IssueBoard component */}
      <IssueBoard project={project} />
    </div>
  );
};
