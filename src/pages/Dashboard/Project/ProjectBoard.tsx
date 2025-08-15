import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import { GET_PROJECT } from '../../../graphql/Query/project';
import CreateIssue from '../Issues/CreateIssue';
import ErrorState from '../../../components/ErrorState';
import ProjectHeader from './ProjectHeader';
import LoadingState from '../../../components/LoadingState';

type TabType = 'issues' | 'sprints' | 'progress' | 'timeline';

interface TabConfig {
  id: TabType;
  label: string;
  path: string;
  allowCreate: boolean;
  description?: string;
}

const TABS: TabConfig[] = [
  {
    id: 'sprints',
    label: 'Sprints',
    path: '/sprints',
    allowCreate: true,
    description: 'Manage project sprints and iterations',
  },
  {
    id: 'issues',
    label: 'Issues',
    path: '/issues',
    allowCreate: true,
    description: 'Track and manage project issues',
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    allowCreate: false,
    description: 'Analyze project progress and metrics',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    path: '/timeline',
    allowCreate: false,
    description: 'View project timeline and milestones',
  },
];

const ProjectBoard = () => {
  const [createTab, setCreateTab] = useState<boolean>(false);

  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('ProjectBoard render - projectId:', projectId);

  const getActiveTabFromPath = (): TabType => {
    const path = location.pathname;
    if (path.includes('/issues')) return 'issues';
    if (path.includes('/sprints')) return 'sprints';
    if (path.includes('/progress')) return 'progress';
    if (path.includes('/timeline')) return 'timeline';
    return 'sprints'; // default
  };

  const activeTab = getActiveTabFromPath();

  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    variables: {
      projectId: projectId as string,
    },
    skip: !projectId,
  });

  // Get project directly from data - NO useState needed
  const project = data?.getProject || null;

  // Stable callback - doesn't change on every render
  const handleTabChange = useCallback(
    (tab: TabType) => {
      const targetPath = `/projects/${projectId}${TABS.find((t) => t.id === tab)?.path}`;
      navigate(targetPath);
    },
    [projectId, navigate]
  );

  const handleCreateClick = useCallback(() => {
    setCreateTab(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setCreateTab(false);
    navigate(`/projects/${projectId}/issues`);
  }, [projectId, navigate, createTab, refetch]);

  if (loading) {
    return <LoadingState size="lg" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to Load Project"
        message={
          error.message ||
          'An unexpected error occurred while loading the project.'
        }
        action={
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        }
      />
    );
  }

  // No project state
  if (!project) {
    return (
      <ErrorState
        title="No Project Found"
        message="We couldn't find the requested project. Please check the project ID or try refreshing."
        action={
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        }
      />
    );
  }

  return (
    <>
      {/* Create Issue Modal/Overlay */}
      {createTab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CreateIssue
              projectId={project.id}
              sprintId=""
              setCreateTaskTab={setCreateTab}
              onSuccess={handleCreateSuccess}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <ProjectHeader project={project} onCreateClick={handleCreateClick} />

        <nav className="bg-white border-b border-gray-200 sticky top-0">
          <div className="mx-auto px-6">
            <div className="flex space-x-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  title={tab.description}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="mx-auto px-6 py-8">
          <div className="transition-all duration-200">
            <Outlet
              context={{
                project,
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectBoard;
