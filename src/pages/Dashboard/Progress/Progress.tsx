import { useOutletContext } from 'react-router-dom';
import { ProjectContextType } from '../Sprint/AllSprints';
import { ProjectStatus } from '../../../types/types';

const ProjectProgress: React.FC = () => {
  const { project } = useOutletContext<ProjectContextType>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress</h2>
          <p className="text-gray-600 mt-1">
            Analyze project progress and metrics
          </p>
        </div>
      </div>

      {/* Progress content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Progress Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === ProjectStatus.ACTIVE
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Created</span>
              <span className="text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Issues Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Issues Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Issues</span>
              <span className="text-2xl font-bold text-gray-900">
                {project.issues?.length || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '45%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>In Progress</span>
              <span>45%</span>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Team Performance
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
            <p className="text-gray-600">Overall Efficiency</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="text-blue-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-blue-700">
          We're working on detailed progress tracking, burndown charts, and team
          performance metrics.
        </p>
      </div>
    </div>
  );
};


export default ProjectProgress;