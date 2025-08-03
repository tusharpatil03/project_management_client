import React, { useCallback, useEffect, useState } from 'react';
import { InterfaceIssue, InterfaceProject } from '../../../types/types';
import { GET_ALL_ISSUES } from '../../../graphql/Query/issue';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import IssueTable from '../../../components/Issues/IssuesTable';

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
      <IssueTable issues={issues} projectId={projectId}/>
    </div>
  );
};
export default IssueBoard;
