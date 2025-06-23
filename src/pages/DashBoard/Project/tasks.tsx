import React from 'react';
import { InterfaceTask } from '../../../types/types';

interface ChildProps {
    tasks: InterfaceTask[] | undefined;
}

const TasksBoard: React.FC<ChildProps> = ({ tasks }) => {
    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        taskId: string,
        columnId: string
    ) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('columnId', columnId);
    };

    if (!tasks) {
        return (
            <>
                <div>No Tasks Available</div>
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(tasks).map(([columnId]) => (
                <div
                    key={columnId}
                    className="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[400px] border border-gray-100"
                    onDragOver={(e) => e.preventDefault()}
                >
                    <h3 className="text-xl font-bold capitalize mb-4 text-blue-700 flex items-center gap-2">
                        <span
                            className={`inline-block w-3 h-3 rounded-full ${
                                columnId === 'todo'
                                    ? 'bg-gray-400'
                                    : columnId === 'in-progress'
                                      ? 'bg-yellow-400'
                                      : 'bg-green-500'
                            }`}
                        ></span>
                    </h3>
                    <div className="flex-1 space-y-4">
                        {tasks.length === 0 && (
                            <div className="text-gray-400 italic text-center mt-8">
                                No tasks
                            </div>
                        )}
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) =>
                                    handleDragStart(e, task.id, columnId)
                                }
                                className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md bg-gray-50 cursor-grab transition-all"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">
                                        {task.title}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TasksBoard;
