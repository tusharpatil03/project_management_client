import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '../../../graphql/Mutation/project';
import {
  CreateProjectInput,
  CreateProjectResponse,
} from '../../../types/types';
import { useNavigate } from 'react-router-dom';

interface CreateProjectProps {
  onProjectCreated?: (project: CreateProjectResponse['createProject']) => void;
}

const initialForm: CreateProjectInput = {
  key: '',
  name: '',
  description: '',
};

const CreateProject: React.FC<CreateProjectProps> = () => {
  const [form, setForm] = useState<CreateProjectInput>(initialForm);
  const [createProject, { loading, error }] = useMutation<
    CreateProjectResponse,
    { input: CreateProjectInput }
  >(CREATE_PROJECT);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createProject({
        variables: { input: form },
      });
      if (data?.createProject) {
        setForm(initialForm);
        setSuccess(true);
        navigate('/dashboard/projects');
      }
    } catch {
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Create New Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="key"
          >
            Project Key
          </label>
          <input
            type="text"
            name="key"
            id="key"
            value={form.key}
            onChange={handleChange}
            placeholder="e.g. AGILE"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="name"
          >
            Project Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Project Name"
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
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your project..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y min-h-[80px]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
        {success && (
          <div className="text-green-600 text-center font-medium mt-2">
            Project created successfully!
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

export default CreateProject;
