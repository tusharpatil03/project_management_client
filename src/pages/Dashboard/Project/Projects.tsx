import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from '../../../graphql/Query/project';
import { InterfaceProject } from '../../../types/types';

const ProjectTable: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<InterfaceProject>();

  const projects: InterfaceProject[] = data?.getAllProjects || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500">{error.message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:ml-64 mt-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Team
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        No projects found.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-blue-700 whitespace-nowrap cursor-pointer hover:underline"
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.name}
                        </th>
                        <td className="px-6 py-4">{project.description}</td>
                        <td className="px-6 py-4"></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {selectedProject && <div className="mt-8"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
