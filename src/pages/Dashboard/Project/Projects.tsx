import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from '../../../graphql/Query/project';
import { InterfaceProject, ProjectStatus } from '../../../types/types';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: ProjectStatus) => {
  const colors: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [ProjectStatus.PLANNED]: 'bg-yellow-100 text-yellow-800',
    [ProjectStatus.COMPLETE]: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const ProjectTable: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_PROJECTS);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all projects including their key, status, creator, and
              other details.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Project Key
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Creator
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {projects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 px-6 text-center text-sm text-gray-500"
                        >
                          No projects found.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/projects/${project.key}`)
                          }
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {project.key}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="font-medium text-blue-600 hover:text-blue-900">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-gray-500 truncate max-w-xs">
                                {project.description}
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(project.status)}`}
                            >
                              {ProjectStatus[project.status]}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="flex items-center">
                              {project.creator?.profile?.avatar && (
                                <img
                                  src={project.creator.profile.avatar}
                                  alt=""
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {project.creator?.firstName}{' '}
                                  {project.creator?.lastName}
                                </div>
                                <div className="text-gray-500">
                                  {project.creator?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add your action here
                                navigate(`/projects/${project.id}`);
                              }}
                            >
                              View
                              <span className="sr-only">, {project.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
