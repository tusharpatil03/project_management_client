import React from 'react';

interface InterfaceProject {
  id: string;
  key: string;
  name: string;
  description?: string | null;
}

interface UserProjectsProps {
  projects: InterfaceProject[] | null | undefined;
}

const UserProjects: React.FC<UserProjectsProps> = ({ projects }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        {/* Optional: Add "View All" link */}
        {projects && projects.length > 0 && (
          <a href="/projects" className="text-sm text-blue-600 hover:underline">
            View All
          </a>
        )}
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/projects/${project.key}`}
              title={`Go to ${project.name}`}
              className="block bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-colors duration-150"
            >
              <h3 className="text-md font-medium text-gray-900 truncate">
                {project.name}
              </h3>
              {project.description ? (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1 italic">
                  No description provided
                </p>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          {/* Empty state illustration */}
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Not assigned to any projects yet.
          </p>
          <a
            href="/projects/new"
            className="mt-3 inline-block text-sm px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Create New Project
          </a>
        </div>
      )}
    </div>
  );
};

export default UserProjects;
