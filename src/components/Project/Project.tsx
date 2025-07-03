import React, { useState } from 'react';
import { GetProjectByIdResponse } from '../../types/types';

interface ProjectDetailsProps {
    project: GetProjectByIdResponse['getProjectById'];
}

const fields = [
    { key: 'id', label: 'Project ID' },
    { key: 'key', label: 'Project Key' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'creatorId', label: 'Creator ID' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
    { key: 'issues', label: 'issues' },
];

const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString() : '-';

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    const [selectedField, setSelectedField] = useState<string>('name');

    const renderFieldValue = (fieldKey: string) => {
        if (fieldKey === 'createdAt' || fieldKey === 'updatedAt') {
            return formatDate(
                project[fieldKey as keyof typeof project] as string
            );
        }
        if (fieldKey === 'issues') {
            if (!project.issues || project.issues.length === 0)
                return <span>No issues</span>;
            return (
                <ul className="list-disc pl-5">
                    {project.issues.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            );
        }
        const value = project[fieldKey as keyof typeof project];
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : '-';
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
                Project Details
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Field Selector */}
                <div className="md:w-1/3">
                    <div className="border rounded-lg overflow-hidden">
                        <ul>
                            {fields.map((field) => (
                                <li
                                    key={field.key}
                                    className={`cursor-pointer px-4 py-3 border-b last:border-b-0 hover:bg-blue-50 transition ${
                                        selectedField === field.key
                                            ? 'bg-blue-100 font-semibold text-blue-700'
                                            : ''
                                    }`}
                                    onClick={() => setSelectedField(field.key)}
                                >
                                    {field.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Field Value Display */}
                <div className="md:w-2/3 flex flex-col justify-center">
                    <div className="border rounded-lg p-6 min-h-[120px] bg-gray-50">
                        <div className="text-lg font-semibold mb-2 text-gray-700">
                            {fields.find((f) => f.key === selectedField)?.label}
                        </div>
                        <div className="text-gray-900 text-base break-words">
                            {renderFieldValue(selectedField)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
