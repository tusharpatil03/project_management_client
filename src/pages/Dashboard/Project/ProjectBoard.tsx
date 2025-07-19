import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, useNavigate } from 'react-router-dom';
import { GET_RECENT_PROJECT } from '../../../graphql/Query/queries';
import { InterfaceProject } from '../../../types/types';
import CreateIssue from './CreateIssue';
import Sprints from './sprint';
import CreateSprint from './CreateSprint';
import IssueBoard from './issues';
import Loader from '../../../components/Loader';

const TABS = ['issues', 'sprints', 'timeline', 'progress'];

const ProjectBoard = () => {
  const [activeTab, setActiveTab] = useState<string>('issues');
  const [project, setProject] = useState<InterfaceProject | null>(null);
  const [createTab, setCreateTab] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_RECENT_PROJECT);

  useEffect(() => {
    const isProject = localStorage.getItem('project');
    if (!isProject) {
      navigate('/project/new');
    }
    if (data?.getRecentProject) {
      setProject(data.getRecentProject);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    if (error.message === 'UnauthenticatedError') {
      navigate('/auth');
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>{error.message}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No Project Found</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'issues':
        return <IssueBoard projectId={project.id} />;
      case 'sprints':
        return <Sprints projectId={project.id} />;
      case 'timeline':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            Timeline feature coming soon
          </div>
        );
      case 'progress':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            Progress analytics will be here
          </div>
        );
      default:
        return null;
    }
  };

  const handleCreateTabs = () => {
    switch (activeTab) {
      case 'issues':
        return (
          <CreateIssue projectId={project.id} setCreateTaskTab={setCreateTab} />
        );
      case 'sprints':
        return (
          <CreateSprint
            projectId={project.id}
            setCreatSprintTab={setCreateTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {createTab ? (
        handleCreateTabs()
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50">
          <header className="bg-white shadow px-6 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <p className="text-gray-500">
                  {project.description || 'No description provided'}
                </p>
              </div>
              <button
                onClick={() => {
                  setCreateTab(true);
                }}
                className={
                  activeTab == 'progress' || activeTab == 'timeline'
                    ? 'hidden'
                    : 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
                }
              >
                + Create
              </button>
            </div>
          </header>

          <nav className="border-b border-gray-200 max-w-7xl mx-auto px-6 mt-4">
            <ul className="flex space-x-6 text-sm font-medium text-gray-600">
              {TABS.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 border-b-2 transition ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="max-w-7xl mx-auto px-6 py-6">{renderTab()}</main>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default ProjectBoard;
