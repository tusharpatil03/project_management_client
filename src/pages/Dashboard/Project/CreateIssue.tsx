import { useState } from 'react';
import {
  CreateIssueInput,
  CreateIssueResponse,
  IssueType,
} from '../../../types/types';
import { useMutation } from '@apollo/client';
import { CREATE_ISSUE } from '../../../graphql/Mutation/mutations';
import CreateTab from '../../../components/CreateTab/CreateTab';
import InputField from '../../../components/InputFiled/InputField';

const initialForm: CreateIssueInput = {
  title: '',
  description: '',
  type: IssueType.TASK,
  sprintId: '',
  assigneeId: '',
  projectId: '',
  dueDate: '',
};

interface CreateIssueProps {
  projectId: string;
  sprintId: string | null;
  setCreateTaskTab: (value: boolean) => void;
  onSuccess: () => void;
}

const CreateIssue: React.FC<CreateIssueProps> = ({
  projectId,
  sprintId,
  setCreateTaskTab,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateIssueInput>({
    ...initialForm,
    projectId,
    sprintId,
  });

  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [createTask, { loading, error }] = useMutation<CreateIssueResponse>(
    CREATE_ISSUE,
    {
      onCompleted: () => {
        onSuccess?.();
      },
    }
  );

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
    if (!formData.title || !formData.dueDate) {
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
    <CreateTab title="Create New Task" onClose={() => setCreateTaskTab(false)}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <InputField
            label="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Task Title"
          />
        </div>
        <div>
          <InputField
            label="description"
            type="text"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            required
            placeholder="Description"
          />
        </div>
        <div>
          <InputField
            label="Assignee"
            type="text"
            name="Assignee"
            value={formData.assigneeId || ''}
            onChange={handleChange}
            required
            placeholder="Assignee"
          />
        </div>
        <div>
          <InputField
            label="DueDate"
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            placeholder="Date"
          />
        </div>
        <div>
          <select>
            <InputField
              label="Type"
              type="type"
              name="type"
              value={formData.type}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as IssueType,
                }));
              }}
              required
            />
            <option value={'BUG'}>BUG</option>
            <option value={'TASK'}>TASK</option>
            <option value={'STORY'}>STORY</option>
            <option value={'EPIC'}>EPIC</option>
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
    </CreateTab>
  );
};

export default CreateIssue;
