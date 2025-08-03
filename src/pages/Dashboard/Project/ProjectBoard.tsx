import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, useSearchParams } from 'react-router-dom';
import { GET_RECENT_PROJECT } from '../../../graphql/Query/project';
import { InterfaceProject, ProjectStatus } from '../../../types/types';
import CreateIssue from './CreateIssue';
import SprintsView from './sprint';
import IssueBoard from './issues';
import Loader from '../../../components/Loader';

type TabType = 'issues' | 'sprints' | 'timeline' | 'progress';

interface TabConfig {
  id: TabType;
  label: string;
  component: React.ReactNode;
  allowCreate: boolean;
  description?: string;
}

interface ProjectHeaderProps {
  project: InterfaceProject;
  onCreateClick: () => void;
  showCreateButton: boolean;
}

interface ErrorStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    id: 'sprints',
    label: 'Sprints',
    component: null, // Will be set dynamically
    allowCreate: true,
    description: 'Manage project sprints and iterations',
  },
  {
    id: 'issues',
    label: 'Issues',
    component: null, // Will be set dynamically
    allowCreate: true,
    description: 'Track and manage project issues',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    component: null, // Will be set dynamically
    allowCreate: false,
    description: 'View project timeline and milestones',
  },
  {
    id: 'progress',
    label: 'Progress',
    component: null, // Will be set dynamically
    allowCreate: false,
    description: 'Analyze project progress and metrics',
  },
];

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onCreateClick,
  showCreateButton,
}) => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="mx-auto px-6 py-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {project.key}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === ProjectStatus.ACTIVE
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status || 'Unknown'}
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            {project.description || 'No description provided'}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              Last updated: {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {showCreateButton && (
          <button
            onClick={onCreateClick}
            className="ml-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg
              className="w-4 h-4"
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
            Create
          </button>
        )}
      </div>
    </div>
  </header>
);

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, action }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
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
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {action}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader size="lg" />
      <p className="mt-4 text-gray-600">Loading project...</p>
    </div>
  </div>
);

const ComingSoonState: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 max-w-md mx-auto">{description}</p>
  </div>
);

const ProjectBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [project, setProject] = useState<InterfaceProject | null>(null);
  const [createTab, setCreateTab] = useState<boolean>(false);

  // Get active tab from URL params, default to 'sprints'
  const activeTab = (searchParams.get('tab') as TabType) || 'sprints';

  const { data, loading, error, refetch } = useQuery(GET_RECENT_PROJECT, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.getRecentProject) {
      setProject(data.getRecentProject);
    }
  }, [data]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setSearchParams({ tab });
    },
    [setSearchParams]
  );

  const handleCreateClick = useCallback(() => {
    setCreateTab(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setCreateTab(false);
    // refetch data or trigger updates
  }, []);

  const currentTabConfig = useMemo(
    () => TABS.find((tab) => tab.id === activeTab) || TABS[0],
    [activeTab]
  );

  const renderTabContent = useMemo(() => {
    if (!project) return null;

    switch (activeTab) {
      case 'issues':
        return <IssueBoard project={project} />;
      case 'sprints':
        return <SprintsView projectId={project.id} />;
      case 'timeline':
        return (
          <ComingSoonState
            title="Timeline Coming Soon"
            description="Project timeline and milestone tracking features are currently in development."
          />
        );
      case 'progress':
        return (
          <ComingSoonState
            title="Progress Analytics Coming Soon"
            description="Advanced project analytics and progress tracking will be available soon."
          />
        );
      default:
        return null;
    }
  }, [activeTab, project]);
  // const handleCreateTabs = () => {
  //   if (createTab) {
  //     return (
  //       <CreateIssue
  //         projectId={project.id}
  //         sprintId=""
  //         setCreateTaskTab={setCreateTab}
  //         onSuccess={() => {}}
  //       />
  //     );
  //   }
  // };

  if (loading) {
    return <LoadingState />;
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
        message="We couldn't find any recent project. Please create a new project or select an existing one."
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
        <ProjectHeader
          project={project}
          onCreateClick={handleCreateClick}
          showCreateButton={currentTabConfig.allowCreate}
        />

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
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

        {/* Main Content */}
        <main className="mx-auto px-6 py-8">
          <div className="transition-all duration-200">{renderTabContent}</div>
        </main>
      </div>

      <Outlet />
    </>
  );
};

export default ProjectBoard;
