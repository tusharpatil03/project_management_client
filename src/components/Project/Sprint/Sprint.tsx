import IssueTable from '../../Issues/IssuesTable';
import { InterfaceSprint } from '../../../types/types';
import CreateIssue from '../../../pages/Dashboard/Project/CreateIssue';
import { useState } from 'react';
import Button from '../../Button/Button';

interface ChildProps {
  sprint: InterfaceSprint;
  refetch: () => void;
  projectId: string;
}

const Sprint: React.FC<ChildProps> = ({ sprint, refetch, projectId }) => {
  const [createTab, setCreateTab] = useState<boolean>(false);

  const onSuccess = () => {
    setCreateTab(false);
    refetch();
  };

  const handleCreateTabs = () => {
    if (createTab) {
      return (
        <CreateIssue
          projectId={sprint.projectId}
          sprintId={sprint.id}
          setCreateTaskTab={setCreateTab}
          onSuccess={onSuccess}
        />
      );
    }
  };

  return createTab ? (
    handleCreateTabs()
  ) : (
    <div>
      <div className="font-semibold">{sprint.title}</div>
      <div className="text-sm text-gray-500">
        Due:{' '}
        {sprint.dueDate ? new Date(sprint.dueDate).toLocaleDateString() : '-'}
      </div>
      <div className="text-sm text-gray-500">
        Status: {sprint.status || '-'}
      </div>
      {sprint.issues ? <IssueTable issues={sprint.issues} projectId={projectId}/> : ''}
      <div>
        <Button
          onClick={() => {
            setCreateTab(true);
          }}
          size="md"
          variant="secondary"
          children="+ create"
        />
      </div>
    </div>
  );
};

export default Sprint;
