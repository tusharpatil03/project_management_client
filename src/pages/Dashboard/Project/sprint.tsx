import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InterfaceSprint } from '../../../types/types';
import { GET_ALL_SPRINTS } from '../../../graphql/Query/queries';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import Sprint from '../../../components/Project/Sprint/Sprint';
import CreateSprint from './CreateSprint';

interface ChildProps {
  projectId: string;
}

const TABS = ['ACTIVE', 'ALL', 'COMPLETE'];
type TabType = (typeof TABS)[number];

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
      setSprints(res.data.getAllSprints);
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
  }, [fetchQuery]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery]);

  const renderActiveTab = () =>
    activeSprint ? (
      <Sprint
        key={activeSprint.id}
        sprint={activeSprint}
        refetch={handleIssueCreated}
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

  const TabNavigation: React.FC<{
    tabs: readonly TabType[];
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    showCreateTab: boolean;
  }> = ({ tabs, activeTab, onTabChange, showCreateTab }) => {
    return (
      <nav className="border-b border-gray-200 max-w-7xl mx-auto px-6 mt-4">
        <ul className="flex flex-row space-x-6 text-sm font-medium text-gray-600">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => onTabChange(tab)}
                className={`pb-2 border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            </li>
          ))}
          <button
            onClick={() => {
              setCreateTab(true);
            }}
            className={
              showCreateTab
                ? 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
                : 'hidden'
            }
          >
            + Create
          </button>
        </ul>
      </nav>
    );
  };

  return createTab ? (
    handleCreateSprint()
  ) : (
    <div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showCreateTab={activeSprint ? false : true}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'ACTIVE' && renderActiveTab()}
        {activeTab === 'ALL' && renderAllTab()}
        {activeTab === 'COMPLETE' && renderCompletedTab()}
      </main>
    </div>
  );
};

export default SprintsView;
