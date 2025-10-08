import { useEffect, useState } from 'react';
import { InterfaceIssue, InterfaceSprint, InterfaceUser } from '../../../types/';
import IssueDetails from '../IssueDetails/IssueDetails';
import React from 'react';
import BaseTable from '../../../components/Table/BaseTable';
import {  IssueTableHeader, IssueTableRow} from './';
import GetMembers from './GetMember';

interface IssueTableProps {
  issues: InterfaceIssue[];
  projectId: string;
  onIssueUpdate: () => void;
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  projectId,
  onIssueUpdate,
}) => {
  const [viewIssueTab, setViewIssueTab] = useState<boolean>(false);
  const [issueId, setIssueId] = useState<string>();
  const [membersTab, setMemberTab] = useState<boolean>(false);
  const [currentAssignee, setCurrentAssignee] = useState<InterfaceUser | null>();

  // Event handlers
  const handleIssueClick = (issueId: string) => {
    setIssueId(issueId);
    setViewIssueTab(true);
  };

  return (
    <div className="space-y-4">
      <BaseTable>
        <IssueTableHeader sortConfig={undefined} onSort={undefined} />
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      No issues found
                    </p>
                    <p className="text-sm text-gray-500">
                      Create your first issue to get started.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <IssueTableRow
                key={issue.id}
                issue={issue}
                onIssueClick={handleIssueClick}
                onAssigneeClick={(
                  issueId: string,
                  assignee: InterfaceUser | undefined
                ) => {
                  setIssueId(issueId);
                  setCurrentAssignee(assignee);
                  setMemberTab(true);
                }}
                onEditClick={setIssueId}
              />
            ))
          )}
        </tbody>
      </BaseTable>

      {viewIssueTab && issueId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <IssueDetails
              setIssueTab={setViewIssueTab}
              issueId={issueId}
              onIssueUpdates={onIssueUpdate}
            />
          </div>
        </div>
      )}

      {membersTab && issueId && (
        //
        <GetMembers
          projectId={projectId}
          issueId={issueId}
          setMemberTab={setMemberTab}
          currentAssigneeId={currentAssignee?.id}
          onAssignmentChange={onIssueUpdate}
        />
      )}
    </div>
  );
};

export default IssueTable;
