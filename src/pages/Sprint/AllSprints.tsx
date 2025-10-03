import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InterfaceSprint } from '../../types/types';
import { GET_ALL_SPRINTS } from '../../graphql/Query/sprint';
import { useQuery } from '@apollo/client';
import Loader from '../../components/Loader';
import Sprint from './Sprint';

interface SprintsViewProps {
  projectId: string;
}

const TABS = ['ACTIVE', 'ALL', 'COMPLETE'] as const;

const SprintsView: React.FC<SprintsViewProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<string>('ACTIVE');
  const [loader, setLoader] = useState(true);
  const [sprints, setSprints] = useState<InterfaceSprint[]>([]);
  const [createTab, setCreateTab] = useState<boolean>(false);

  const { error, refetch } = useQuery<{
    getAllSprints: InterfaceSprint[];
  }>(GET_ALL_SPRINTS, {
    variables: { projectId },
    skip: true,
  });

  const fetchQuery = useCallback(async () => {
    try {
      setLoader(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 300));
      const res = await refetch();

      if (res.data?.getAllSprints) {
        setSprints(res.data.getAllSprints);
      }
      await delay;
    } catch (err) {
      console.error('Failed to fetch sprints:', err);
    } finally {
      setLoader(false);
    }
  }, [refetch]);

  const activeSprint = useMemo(
    () => sprints.find((sprint) => sprint.status === 'ACTIVE'),
    [sprints]
  );

  const completedSprints = useMemo(
    () => sprints.filter((sprint) => sprint.status === 'COMPLETE'),
    [sprints]
  );

  const handleRefresh = useCallback(() => {
    fetchQuery();
  }, [fetchQuery]);

  const handleCreateSuccess = useCallback(() => {
    setCreateTab(false);
    fetchQuery();
  }, [fetchQuery]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery]);

  const EmptyState: React.FC<{ message: string; showCreate?: boolean }> = ({
    message,
    showCreate = false,
  }) => (
    <div className="text-center py-12">
      <svg
        className="w-12 h-12 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {showCreate && (
        <button
          onClick={() => setCreateTab(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Your First Sprint
        </button>
      )}
    </div>
  );

  const renderContent = () => {
    if (createTab) {
      return (
        <div className="mx-auto px-6 py-6">
          <CreateSprint
            projectId={projectId}
            setCreatSprintTab={setCreateTab}
            onSuccess={handleCreateSuccess}
          />
        </div>
      );
    }

    if (activeTab === 'ACTIVE') {
      return activeSprint ? (
        <Sprint
          key={activeSprint.id}
          sprint={activeSprint}
          refetch={handleRefresh}
          projectId={projectId}
        />
      ) : (
        <EmptyState
          message="No active sprints"
          showCreate={sprints.length === 0}
        />
      );
    }

    if (activeTab === 'ALL') {
      return sprints.length > 0 ? (
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <Sprint
              key={sprint.id}
              sprint={sprint}
              refetch={handleRefresh}
              projectId={projectId}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No sprints found" showCreate />
      );
    }

    if (activeTab === 'COMPLETE') {
      return completedSprints.length > 0 ? (
        <div className="space-y-4">
          {completedSprints.map((sprint) => (
            <Sprint
              key={sprint.id}
              sprint={sprint}
              refetch={handleRefresh}
              projectId={projectId}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No completed sprints" />
      );
    }

    return null;
  };

  if (loader) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">Failed to load sprints</p>
          <p className="text-sm text-gray-500 mt-1">
            Please try refreshing the page
          </p>
        </div>
        <button
          onClick={fetchQuery}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showCreateTab={!createTab && (!activeSprint || activeTab !== 'ACTIVE')}
        setCreateTab={setCreateTab}
      />

      <main className="mx-auto px-6 py-6">{renderContent()}</main>
    </div>
  );
};
export default SprintsView;

import { useOutletContext } from 'react-router-dom';
import { InterfaceProject } from '../../types/types';
import TabNavigation from '../../components/TabNavigation/TabNavigation';
import CreateSprint from './CreateSprint';

export interface ProjectContextType {
  project: InterfaceProject;
  refetch: () => void;
  onCreateSuccess: () => void;
}

export const ProjectSprints: React.FC = () => {
  const { project } = useOutletContext<ProjectContextType>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sprints</h2>
          <p className="text-gray-600 mt-1">
            Manage project sprints and iterations
          </p>
        </div>
      </div>
      <SprintsView projectId={project.id} />
    </div>
  );
};
