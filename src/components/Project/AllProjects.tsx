import React, { useState } from 'react';
import { InterfaceProject } from '../../pages/DashBoard/DashBoard';
import ProjectDetails from './Project';

interface ProjectTableProps {
    projects: InterfaceProject[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<InterfaceProject>();

    return (
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
                                    <td className="px-6 py-4">{project.team || '-'}</td>
                                    <td className="px-6 py-4">
                                        {project.dueDate
                                            ? new Date(project.dueDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {selectedProject && (
                <div className="mt-8">
                    <ProjectDetails project={selectedProject} />
                </div>
            )}
        </div>
    );
};

export default ProjectTable;
