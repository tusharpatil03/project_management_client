import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InterfaceSprint } from '../../../types/types';
import { GET_ALL_SPRINTS } from '../../../graphql/Query/sprint';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import Sprint from './Sprint';
import CreateSprint from './CreateSprint';
import TabNavigation from '../../../components/TabNavigation/TabNavigation';

interface ChildProps {
  projectId: string;
}

const TABS = ['ACTIVE', 'ALL', 'COMPLETE'];

const SprintsView: React.FC<ChildProps> = ({ projectId }) => {
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
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const res = await refetch();

      if (res.data.getAllSprints) {
        setSprints(res.data.getAllSprints);
      }
      await Promise.all([delay]);
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

  const handleIssueCreated = useCallback(() => {
    fetchQuery();
  }, [fetchQuery, createTab]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery]);

  const renderActiveTab = () =>
    activeSprint ? (
      <Sprint
        key={activeSprint.id}
        sprint={activeSprint}
        refetch={handleIssueCreated}
        projectId={projectId}
      />
    ) : (
      <EmptyState message="No active sprints" />
    );

  const renderAllTab = () =>
    sprints.length > 0 ? (
      <div className="p-6 bg-white rounded-lg shadow">
        {sprints.map((sprint) => (
          <Sprint
            key={sprint.id}
            sprint={sprint}
            refetch={handleIssueCreated}
            projectId={projectId}
          />
        ))}
      </div>
    ) : (
      <EmptyState message="No sprints found" />
    );

  const renderCompletedTab = () =>
    completedSprints.length > 0 ? (
      <div className="p-6 bg-white rounded-lg shadow">
        {completedSprints.map((sprint) => (
          <Sprint
            key={sprint.id}
            sprint={sprint}
            refetch={handleIssueCreated}
            projectId={projectId}
          />
        ))}
      </div>
    ) : (
      <EmptyState message="No completed sprints" />
    );

  const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-12 text-gray-500">{message}</div>
  );

  const FullPageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Loader size="lg" />
    </div>
  );

  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-500 py-8">{message}</div>
  );

  const handleCreateSprint = () => {
    if (createTab) {
      return (
        <CreateSprint projectId={projectId} setCreatSprintTab={setCreateTab} />
      );
    }
  };

  if (loader) return <FullPageLoader />;
  if (error) return <ErrorMessage message="Failed to load sprints" />;

  return createTab ? (
    handleCreateSprint()
  ) : (
    <div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showCreateTab={activeSprint ? false : true}
        setCreateTab={setCreateTab}
      />

      <main className="mx-auto px-6 py-6">
        {activeTab === 'ACTIVE' && renderActiveTab()}
        {activeTab === 'ALL' && renderAllTab()}
        {activeTab === 'COMPLETE' && renderCompletedTab()}
      </main>
    </div>
  );
};

export default SprintsView;

import { useOutletContext } from 'react-router-dom';
import { InterfaceProject } from '../../../types/types';

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
