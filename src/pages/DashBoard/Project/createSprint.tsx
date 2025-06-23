import { CreateSprintInput, TaskStatus } from '../../../types/types';
import { CREATE_SPRINT } from '../../../graphql/Mutation/mutations';
import { CreateSprintResponse } from '../../../types/types';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

interface ChildProps {
    projectId: string;
    setCreatSprintTab: (value: boolean) => void;
}

const initialForm = {
    title: '',
    description: '',
    dueDate: '',
    status: TaskStatus.TODO,
    tasks: [],
};

const CreateSprint: React.FC<ChildProps> = ({
    projectId,
    setCreatSprintTab,
}) => {
    const [formData, setFormData] = useState<CreateSprintInput>({
        ...initialForm,
        projectId,
    });
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [createSprint, { loading, error }] =
        useMutation<CreateSprintResponse>(CREATE_SPRINT);

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
            const res = await createSprint({
                variables: {
                    input: {
                        ...formData,
                        dueDate: new Date(formData.dueDate).toISOString(),
                    },
                },
            });
            if (!res?.data?.createSprint) {
                setFormError('Failed to create task. Please try again.');
                return;
            }
            setSuccess(true);
            setFormData({ ...initialForm, projectId });
            setCreatSprintTab(false);
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
                onClick={() => setCreatSprintTab(false)}
                aria-label="Close"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                Create New Sprint
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
                        placeholder="Sprint Title"
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
                        placeholder="Describe the sprint..."
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
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                status: e.target.value as unknown as TaskStatus,
                            }))
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value={TaskStatus.TODO}>TODO</option>
                        <option value={TaskStatus.IN_PROGRESS}>
                            IN_PROGRESS
                        </option>
                        <option value={TaskStatus.DONE}>DONE</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Sprint'}
                </button>
                {success && (
                    <div className="text-green-600 text-center font-medium mt-2">
                        Sprint created successfully!
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

export default CreateSprint;
