import { InterfaceProject, ProjectStatus } from '../../../types/types';

interface ProjectHeaderProps {
  project: InterfaceProject;
  onCreateClick: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onCreateClick,
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
      </div>
    </div>
  </header>
);

export default ProjectHeader;
