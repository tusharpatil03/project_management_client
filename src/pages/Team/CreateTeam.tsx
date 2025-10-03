import React, { useState } from 'react';
import { CREATE_TEAM } from '../../graphql/Mutation/team';
import { CreateTeamInput } from '../../types/types';
import { useMutation } from '@apollo/client';
import { useMessage } from '../../components/ShowMessage';
import { useNavigate } from 'react-router-dom';


function CreateTeam() {
  const [formData, setFormData] = useState<CreateTeamInput>({
    name: '',
  });

  const navigate = useNavigate();

  const [createTeam, { loading }] = useMutation(CREATE_TEAM, {
    onCompleted: () => {
      setTimeout(() => {
        navigate('/poeple/teams');
      }, 100);
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const { showError, showSuccess } = useMessage();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      await createTeam({
        variables: {
          input: { ...formData },
        },
      });
      showSuccess('Team Created');
    } catch (e) {
      showError('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🚀 Create New Team
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Organize members into a team and start collaborating instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Team Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              formError ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-gray-900`}
            placeholder="Enter your team name"
          />
          {formError && (
            <p className="mt-1 text-sm text-red-500">{formError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
