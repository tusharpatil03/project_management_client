// import { useState } from 'react';
import { InterfaceIssue } from '../../types/types';
import Table from '../Table/Table';

interface ChildProps {
  issues: InterfaceIssue[];
}

const IssueTable: React.FC<ChildProps> = ({ issues }) => {
  // const [action, setAction] = useState('');
  
  const issueColumns = [
    {
      label: 'Title',
      render: (issue: InterfaceIssue) => issue.title,
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
        <button onClick={()=>{issue.id}} className="text-blue-600 hover:underline">...</button>
      ),
    },
  ];

  return (
    <Table
      data={issues}
      columns={issueColumns}
      getRowKey={(issue) => issue.id}
    />
  );
};

export default IssueTable;
