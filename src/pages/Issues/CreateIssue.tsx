import { useEffect, useState } from 'react';
import {
  CreateIssueInput,
  CreateIssueResponse,
  InterfaceUser,
  IssueType,
} from '../../types';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ISSUE } from '../../graphql/Mutation/issue';
import CreateTab from '../../components/Cards/CreateIssueCard';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import TextAreaField from '../../components/InputField/TextArea';
import { GET_ALL_MEMBERS } from '../../graphql/Query/team';
import Members from '../../components/Team/Members';
import { Calendar, Search, Type, User, X } from 'lucide-react';
import Avatar from '../../components/Profile/Avatar';

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
  const [members, setMembers] = useState<InterfaceUser[]>();
  const [membersTab, setMemberTab] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedMember = members?.find((m) => m.id === formData.assigneeId);

  const {
    loading: membersLoading,
    error: membersError,
    data: membersData,
  } = useQuery(GET_ALL_MEMBERS, {
    variables: {
      projectId: projectId,
    },
  });

  useEffect(() => {
    if (membersData?.getProjectTeamsMembers) {
      setMembers(membersData.getProjectTeamsMembers);
    }
  }, [membersData]);

  const [createTask, { loading, error }] =
    useMutation<CreateIssueResponse>(CREATE_ISSUE);

  const handleMemberClick = (memberId: string) => {
    setFormData((prev) => ({ ...prev, assigneeId: memberId }));
    setMemberTab(false);
    setSearchTerm('');
  };

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
      if (!res?.data?.createIssue || error) {
        setFormError('Failed to create task. Please try again.');
        return;
      }
      setSuccess(true);
      onSuccess();
      setFormData({ ...initialForm, projectId });
      setCreateTaskTab(false);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    }
  };

  return (
    <CreateTab title="Create New Issue" onClose={() => setCreateTaskTab(false)}>
      {/* Members Overlay - Positioned on top with high z-index */}
      {membersTab && (
        <div className="absolute inset-4 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Select Assignee
            </h3>
            <button
              onClick={() => setMemberTab(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="max-h-90 overflow-y-auto pr-2">
            <Members
              members={members}
              handleClick={handleMemberClick}
              loading={membersLoading}
              error={membersError?.message}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Form Section */}
        <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <InputField
              label="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required={true}
              placeholder="Enter issue title"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as IssueType,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BUG">🐛 Bug</option>
                    <option value="TASK">✅ Task</option>
                    <option value="STORY">📖 Story</option>
                    <option value="EPIC">🚀 Epic</option>
                  </select>
                </div>
              </div>

            </div>

            <TextAreaField
              label="description"
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <div
                onClick={() => setMemberTab(!membersTab)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white"
              >
                {selectedMember ? (
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={selectedMember.firstName}
                      src={selectedMember.profile?.avatar || ''}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <User className="w-5 h-5" />
                    <span className="text-sm">Select assignee</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <Button maxWidth={true} size="md" loading={loading} type="submit">
              Create Issue
            </Button>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                ✅ Issue created successfully!
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {formError}
              </div>
            )}
          </div>
        </form>
      </div>
    </CreateTab>
  );
};

export default CreateIssue;
