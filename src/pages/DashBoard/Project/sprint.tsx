import React from 'react';
import { InterfaceSprint } from '../../../types/types';

interface ChildProps {
    sprints: InterfaceSprint[] | undefined
}

const Sprints: React.FC<ChildProps> = ({ sprints }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Sprints</h2>
            {sprints && sprints.length > 0 ? (
                <ul>
                    {sprints.map((sprint) => (
                        <li key={sprint.id} className="mb-4">
                            <div className="font-semibold">{sprint.title}</div>
                            <div className="text-sm text-gray-500">
                                Due:{' '}
                                {sprint.dueDate
                                    ? new Date(
                                          sprint.dueDate
                                      ).toLocaleDateString()
                                    : '-'}
                            </div>
                            <div className="text-sm text-gray-500">
                                Status: {sprint.status || '-'}
                            </div>
                            {sprint.tasks && sprint.tasks.length > 0 && (
                                <ul className="ml-4 mt-2 list-disc">
                                    {sprint.tasks.map((task) => (
                                        <li key={task.id}>
                                            {task.title} (
                                            {task.dueDate
                                                ? new Date(
                                                      task.dueDate
                                                  ).toLocaleDateString()
                                                : '-'}
                                            )
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No sprints found.</div>
            )}
        </div>
    );
};


export default Sprints;