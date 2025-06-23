import { CreateSprintInput, TaskStatus } from '../../types/types';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SPRINT } from '../../graphql/Mutation/mutations';
import { CreateSprintResponse } from '../../types/types';

const createSprint = async () => {
    const [form, setForm] = useState<CreateSprintInput>({
        title: '',
        description: '',
        projectId: '',
        dueDate: '',
        status: TaskStatus.TODO,
    });
    const [createSprintMutation, { loading, error }] = useMutation<
        CreateSprintResponse,
        { input: CreateSprintInput }
    >(CREATE_SPRINT);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const projectId = localStorage.getItem('projectId');
        if (!projectId) {
            setSuccess(false);
            return;
        }
        setForm((prev) => ({
            ...prev,
            projectId: projectId,
        }));
        try {
            const { data } = await createSprintMutation({
                variables: { input: form },
            });
            if (data?.createSprint) {
                setForm({
                    title: '',
                    description: '',
                    projectId: '',
                    dueDate: '',
                    status: TaskStatus.TODO,
                });
                setSuccess(true);
            }
        } catch {
            setSuccess(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                Create New Sprint
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="title"
                    >
                        Sprint title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Sprint 1"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="e.g. Sprint 1"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="DueDate"
                    >
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        required
                        className="
w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
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
                {error && (
                    <div className="text-red-500 text-center font-medium mt-2">
                        {error.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default createSprint;
