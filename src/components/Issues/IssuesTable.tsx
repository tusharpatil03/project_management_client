// import { useState } from 'react';
import { useEffect, useState } from 'react';
import { InterfaceIssue } from '../../types/types';
import Table from '../Table/Table';
import IssueDetails from './IssueDetails';
import DeleteTab from '../Actions/DeleteTab';
import { useMutation } from '@apollo/client';
import { DELETE_ISSUES } from '../../graphql/Mutation/issue';
import { showError } from '../../utils/showError';

interface ChildProps {
  issues: InterfaceIssue[];
  projectId: string;
}

const IssueTable: React.FC<ChildProps> = ({ issues, projectId }) => {
  const [viewIssueTab, setViewIssueTab] = useState<boolean>(false);
  const [issueId, setIssueId] = useState<string>();
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [showDeleteTab, setShowDeleteTab] = useState<boolean>(false);


  const [deleteIssue, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_ISSUES, {
      onCompleted: (data) => {
        if (data?.removeIssue?.success) {
          //showSuccess('Issue deleted successfully');
          setSelectedIssue('');
          setShowDeleteTab(false);
          // onIssueDeleted?.(); // Refresh the issues list
        } else {
          showError(data?.removeIssue?.message || 'Delete failed');
        }
      },
      onError: (error) => {
        showError(error.message || 'Delete failed');
      },
    });

  useEffect(() => {
    if (deleteError) {
      showError('Delete Task Failed: ' + deleteError.message);
    }
  }, [deleteError]);

  const handleDeleteIssue = async () => {
    console.log('IssueId:', selectedIssue, 'ProjectId: ', projectId);
    if (!selectedIssue || !projectId) {
      showError('No issue selected or project not found');
      return;
    }

    try {
      await deleteIssue({
        variables: {
          input: {
            issueId: selectedIssue,
            projectId: projectId,
          },
        },
      });
    } catch (error) {
      console.error('Delete error:', error);
      showError('Failed to delete issue');
    }
  };

  if (deleteError) {
    showError('Delete Task Failed');
  }

  const handleClick = (issueId: string) => {
    setIssueId(issueId);
    setViewIssueTab(true);
  };

  const handleCheckboxChange = (issueId: string) => {
    setSelectedIssue((prevId) => (prevId === issueId ? '' : issueId));
    setShowDeleteTab(true);
  };

  const issueColumns = [
    {
      label: 'Select',
      render: (issue: InterfaceIssue) => (
        <input
          type="checkbox"
          checked={selectedIssue === issue.id}
          onChange={() => handleCheckboxChange(issue.id)}
          className="w-4 h-4"
        />
      ),
    },
    {
      label: 'Title',
      render: (issue: InterfaceIssue) => issue.title,
      handleClick,
    },
    {
      label: 'Type',
      render: (issue: InterfaceIssue) => issue.type,
    },
    {
      label: 'Assignee',
      render: (issue: InterfaceIssue) =>
        issue.assignee
          ? `${issue.assignee.firstName} ${issue.assignee.lastName}`
          : 'Unassigned',
    },
    {
      label: 'Due Date',
      render: (issue: InterfaceIssue) =>
        issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-',
    },
    {
      label: 'Action',
      render: (issue: InterfaceIssue) => (
        <button
          onClick={() => {
            issue.id;
          }}
          className="text-blue-600 hover:underline"
        >
          ...
        </button>
      ),
    },
  ];

  return (
    <div className="relative">
      <Table
        data={issues}
        columns={issueColumns}
        getRowKey={(issue) => issue.id}
      />
      {viewIssueTab && issueId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="relative z-50">
            <IssueDetails setIssueTab={setViewIssueTab} issueId={issueId} />
          </div>
        </div>
      )}
      {showDeleteTab && selectedIssue && (
        <DeleteTab
          handleDelete={() => {
            handleDeleteIssue();
            setSelectedIssue('');
            setShowDeleteTab(false);
          }}
          setDeleteTab={setShowDeleteTab}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default IssueTable;
