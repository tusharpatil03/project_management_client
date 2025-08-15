import { useEffect, useState } from 'react';
import {
  CreateIssueInput,
  CreateIssueResponse,
  InterfaceUser,
  IssueType,
  InterfaceSprint,
} from '../../../types/types';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ISSUE } from '../../../graphql/Mutation/issue';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import TextAreaField from '../../../components/InputField/TextArea';
import { GET_ALL_MEMBERS } from '../../../graphql/Query/team';
import Members from '../../../components/Team/Members';
import { Search, Type, User, X, Plus, Minus } from 'lucide-react';
import Avatar from '../../../components/Profile/Avatar';

interface CreateIssuesInSprintProps {
  sprint: InterfaceSprint;
  projectId: string;
  onSuccess: () => void;
}

const CreateIssuesInSprint: React.FC<CreateIssuesInSprintProps> = ({
  sprint,
  projectId,
  onSuccess,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<CreateIssueInput>({
    title: '',
    description: '',
    type: IssueType.TASK,
    parent: undefined,
    sprintId: sprint.id,
    assigneeId: '',
    projectId: projectId,
    dueDate: sprint.dueDate || '',
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
    if (!formData.title) {
      setFormError('Please enter a title for the issue.');
      return;
    }

    try {
      const res = await createTask({
        variables: {
          input: {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
          },
        },
      });
      
      if (!res?.data?.createIssue || error) {
        setFormError('Failed to create issue. Please try again.');
        return;
      }
      
      setSuccess(true);
      // Reset form but keep sprint context
      setFormData({
        title: '',
        description: '',
        type: IssueType.TASK,
        parent: undefined,
        sprintId: sprint.id,
        assigneeId: '',
        projectId: projectId,
        dueDate: sprint.dueDate || '',
      });
      
      // Call onSuccess to refetch sprint data
      onSuccess();
      
      // Auto-collapse after successful creation
      setTimeout(() => {
        setIsExpanded(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    }
  };

  // Only show for active sprints
  if (sprint.status?.toLowerCase() !== 'active') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg overflow-hidden">
      {/* Toggle Header */}
      <div 
        className="px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <Minus className="w-4 h-4 text-blue-600" />
            ) : (
              <Plus className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-sm font-medium text-blue-800">
              Quick Add Issue to Sprint
            </span>
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        </div>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-blue-200 bg-white relative">
          {/* Members Overlay */}
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

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Title and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Issue Title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required={true}
                  placeholder="Enter issue title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="BUG">🐛 Bug</option>
                    <option value="TASK">✅ Task</option>
                    <option value="STORY">📖 Story</option>
                    <option value="EPIC">🚀 Epic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <TextAreaField
              label="Description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe the issue..."
            />

            {/* Assignee */}
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
                      src={selectedMember.avatar}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <User className="w-5 h-5" />
                    <span className="text-sm">Select assignee (optional)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sprint Info Display */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Sprint Context (Auto-filled)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Sprint:</span>
                  <span className="ml-2 font-medium text-gray-900">{sprint.title}</span>
                </div>
                <div>
                  <span className="text-gray-600">Due Date:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {sprint.dueDate 
                      ? new Date(sprint.dueDate).toLocaleDateString()
                      : 'Not set'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                maxWidth={false}
                size="sm"
                loading={loading}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Issue to Sprint
              </Button>
              
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm text-center">
                Issue added to sprint successfully!
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                {formError}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateIssuesInSprint;