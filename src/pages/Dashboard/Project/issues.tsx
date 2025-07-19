import React, { useCallback, useEffect, useState } from 'react';
import { InterfaceIssue } from '../../../types/types';
import { GET_ALL_ISSUES } from '../../../graphql/Query/queries';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import IssueTable from '../../../components/Issues/IssuesTable';

const IssueBoard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [issues, setIssues] = useState<InterfaceIssue[]>([]);
  const [loader, setLoader] = useState(true);

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
      setIssues(allIssues);
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
    <IssueTable issues={issues} />
  );
};
export default IssueBoard;
