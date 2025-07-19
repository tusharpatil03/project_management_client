import React, { useCallback, useEffect, useState } from 'react';
import { InterfaceSprint } from '../../../types/types';
import { GET_ALL_SPRINTS } from '../../../graphql/Query/queries';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';

interface ChildProps {
  projectId: string;
}

const Sprints: React.FC<ChildProps> = ({ projectId }) => {
  const [sprints, setsprints] = useState<InterfaceSprint[]>([]);
  const [loader, setLoader] = useState(true);

  const { error, refetch } = useQuery<{ getAllSprints: InterfaceSprint[] }>(
    GET_ALL_SPRINTS,
    {
      variables: { projectId },
      skip: true,
    }
  );

  const fetchIssue = useCallback(async () => {
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const res = await refetch();
      const allSprints = res.data.getAllSprints || [];

      await Promise.all([delay]);
      setsprints(allSprints);
    } catch (err) {
      console.error('Failed to fetch sprints:', err);
    } finally {
      setLoader(false);
    }
  }, [refetch]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

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
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Sprints</h2>
      {sprints && sprints.length > 0 ? (
        <ul>
          {sprints.map((sprint) => (
            <li key={sprint.id} className="mb-4">
              <div className="font-semibold">{sprint.title}</div>
              <div className="text-sm text-gray-500">
                Due:{' '}
                {sprint.dueDate
                  ? new Date(sprint.dueDate).toLocaleDateString()
                  : '-'}
              </div>
              <div className="text-sm text-gray-500">
                Status: {sprint.status || '-'}
              </div>
              {sprint.issues && sprint.issues.length > 0 && (
                <ul className="ml-4 mt-2 list-disc">
                  {sprint.issues.map((issue) => (
                    <li key={issue.id}>
                      {issue.title} (
                      {issue.dueDate
                        ? new Date(issue.dueDate).toLocaleDateString()
                        : '-'}
                      )
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>No sprints found.</div>
      )}
    </div>
  );
};

export default Sprints;
