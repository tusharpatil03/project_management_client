import React from 'react';
import { InterfaceIssue } from '../../../types';
import { useMutation } from '@apollo/client';
import { UPDATE_ISSUE } from '../../../graphql/Mutation/issue';
import CreateTab from '../../../components/Cards/CreateIssueCard';
import { useMessage } from '../../../components/ShowMessage';
import { IssueDetailsForm } from './';
import { IssueMetadata } from './';
import { FormActions } from './';
import {  UpdateIssueInput } from '../../../types/issue';
import GetMembers from '../IssueTable/GetMember';
import Avatar from '../../../components/Profile/Avatar';

interface EditIssueProps {
  issue: InterfaceIssue;
  projectId: string;
  onIssueUpdated: () => void;
  toggleTab: () => void;
}

const EditIssue: React.FC<EditIssueProps> = ({
  issue,
  projectId,
  onIssueUpdated,
  toggleTab,
}) => {
  const [formData, setFormData] = React.useState<UpdateIssueInput>({
    issueId: issue.id,
    title: issue.title,
    description: issue.description || '',
    projectId: projectId,
    status: issue.status,
    type: issue.type,
    priority: issue.priority,
    dueDate: issue.dueDate
      ? new Date(issue.dueDate).toISOString().slice(0, 16)
      : '',
    assigneeId: issue.assignee?.id || undefined,
  });

  // Track assignee for display (update on assignment)
  const [assignee, setAssignee] = React.useState(issue.assignee || null);
  const [assigneeTab, setAssigneeTab] = React.useState(false);

  const { showSuccess, showError } = useMessage();

  const [updateIssue, { loading }] = useMutation(UPDATE_ISSUE, {
    onCompleted: () => {
      showSuccess('Issue updated successfully!');
      onIssueUpdated();
      toggleTab();
    },
    onError: (err) => {
      showError(err.message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateIssue({
      variables: {
        input: {
          ...formData,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : undefined,
        },
      },
    });
  };

  return (
    <div>
      <CreateTab title="Edit Issue" onClose={toggleTab}>
        <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <IssueDetailsForm 
              formData={formData} 
              onChange={handleChange} 
            />

            {/* Assignee section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
                onClick={() => setAssigneeTab(true)}
                tabIndex={0}
                role="button"
                aria-label="Change assignee"
              >
                {assignee ? (
                  <>
                    <Avatar
                      firstName={assignee.firstName}
                      lastName={assignee.lastName}
                      src={assignee.profile?.avatar || ''}
                    />
                    <span className="font-medium text-gray-900">
                      {assignee.firstName} {assignee.lastName}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 italic">Unassigned</span>
                )}
                <span className="ml-auto text-xs text-blue-600 underline">Change</span>
              </div>
              {assigneeTab && (
                <GetMembers
                  projectId={projectId}
                  issueId={issue.id}
                  setMemberTab={setAssigneeTab}
                  currentAssigneeId={assignee?.id}
                  onAssignmentChange={(newAssigneeId: string, memberName: string) => {
                    // Set a minimal InterfaceUser object for display; ideally refetch issue after assignment for full data
                    setAssignee((prev) => ({
                      id: newAssigneeId,
                      firstName: memberName.split(' ')[0] || '',
                      lastName: memberName.split(' ').slice(1).join(' ') || '',
                      email: prev?.email || '',
                      isVerified: false,
                      projects: [],
                      sprints: [],
                      activities: [],
                      teams: [],
                      createdAt: '',
                      updatedAt: '',
                      profile: prev?.profile || {},
                      createdTeams: [],
                      createdIssues: [],
                      assignedIssues: [],
                    }));
                    setFormData((prev) => ({ ...prev, assigneeId: newAssigneeId }));
                  }}
                />
              )}
            </div>

            <IssueMetadata 
              formData={formData}
              onChange={handleChange}
            />

            <FormActions 
              onCancel={toggleTab}
              loading={loading}
            />
          </div>
        </form>
      </CreateTab>
    </div>
  );
};

export default EditIssue;
