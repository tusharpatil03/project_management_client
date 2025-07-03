import { useState } from 'react';
import { CreateIssueInput, CreateIssueResponse, IssueType } from '../../../types/types';
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../../../graphql/Mutation/mutations';
import { IssueStatus } from '../../../types/types';

const initialForm: CreateIssueInput = {
    title: '',
    description: '',
    type: IssueType.TASK,
    assigneeId: '',
    projectId: '',
    dueDate: '',
    status: IssueStatus.TODO,
};

interface CreateTaskProps {
    projectId: string;
    setCreateTaskTab: (value: boolean) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({
    projectId,
    setCreateTaskTab,
}) => {
    const [formData, setFormData] = useState<CreateIssueInput>({
        ...initialForm,
        projectId,
    });
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [createTask, { loading, error }] =
        useMutation<CreateIssueResponse>(CREATE_TASK);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setSuccess(false);

        // Basic validation
        if (!formData.title || !formData.description) {
            setFormError('Please fill in all required fields.');
            return;
        }

        try {
            const res = await createTask({
                variables: {
                    input: {
                        ...formData,
                        dueDate: new Date(formData.dueDate).toISOString(),
                    },
                },
            });
            if (!res?.data?.createIssue) {
                setFormError('Failed to create task. Please try again.');
                return;
            }
            setSuccess(true);
            setFormData({ ...initialForm, projectId });
            setCreateTaskTab(false);
        } catch (err: any) {
            setFormError(err.message || 'An error occurred.');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 mt-8 relative">
            {/* Cross button */}
            <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => setCreateTaskTab(false)}
                aria-label="Close"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                Create New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="title"
                    >
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Task Title"
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="description"
                    >
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y min-h-[80px]"
                        placeholder="Describe the task..."
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="assigneeId"
                    >
                        Assignee ID
                    </label>
                    <input
                        name="assigneeId"
                        type="text"
                        id="assigneeId"
                        value={formData.assigneeId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Assignee User ID"
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="dueDate"
                    >
                        Due Date
                    </label>
                    <input
                        name="dueDate"
                        type="datetime-local"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="status"
                    >
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                status: e.target.value as unknown as IssueStatus,
                            }));
                            console.log(e.target.value);
                        }}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value={'TODO'}>TODO</option>
                        <option value={'IN_PROGRESS'}>IN_PROGRESS</option>
                        <option value={'DONE'}>DONE</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Task'}
                </button>
                {success && (
                    <div className="text-green-600 text-center font-medium mt-2">
                        Task created successfully!
                    </div>
                )}
                {(formError || error) && (
                    <div className="text-red-500 text-center font-medium mt-2">
                        {formError || error?.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateTask;
