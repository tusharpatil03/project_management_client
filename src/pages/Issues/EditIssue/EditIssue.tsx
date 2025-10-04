import React from 'react';
import { InterfaceIssue, IssueType } from '../../../types/types';
import { useMutation } from '@apollo/client';
import { UPDATE_ISSUE } from '../../../graphql/Mutation/issue';
import Avatar from '../../../components/Profile/Avatar'; //required to show assginee
import MemberSearch from '../../User/GetUserBySearch'; // search assignee
import CreateTab from '../../../components/CreateElements/CreateIssueCard';
import { useMessage } from '../../../components/ShowMessage';
import { IssueDetailsForm } from './components/IssueDetailsForm';
import { IssueMetadata } from './components/IssueMetadata';
import { FormActions } from './components/FormActions';
import { IssuePriority, UpdateIssueInput } from '../../../types/issue';

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
