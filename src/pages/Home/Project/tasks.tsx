import React from 'react';
import { InterfaceIssue } from '../../../types/types';

interface ChildProps {
    issues: InterfaceIssue[] | undefined;
}

const IssueBoard: React.FC<ChildProps> = ({ issues }) => {
    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        issueId: string,
        columnId: string
    ) => {
        e.dataTransfer.setData('issueId', issueId);
        e.dataTransfer.setData('columnId', columnId);
    };

    if (!issues) {
        return (
            <>
                <div>No issues Available</div>
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(issues).map(([columnId]) => (
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
                        {issues.length === 0 && (
                            <div className="text-gray-400 italic text-center mt-8">
                                No issues
                            </div>
                        )}
                        {issues.map((issue) => (
                            <div
                                key={issue.id}
                                draggable
                                onDragStart={(e) =>
                                    handleDragStart(e, issue.id, columnId)
                                }
                                className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md bg-gray-50 cursor-grab transition-all"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">
                                        {issue.title}
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

export default IssueBoard;
