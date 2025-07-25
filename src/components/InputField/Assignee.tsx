import Avatar from '../Profile/Avatar';

interface Assignee {
  firstName: string;
  lastName: string;
  avatar: string;
}

interface ChildProps {
  assignee: Assignee | undefined;
  setMemeberstab: any;
}
const AssigneeInput: React.FC<ChildProps> = ({ assignee, setMemeberstab }) => {
  return (
    <div
      onClick={() => setMemeberstab(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: '#fafafa',
        width: 'fit-content',
        minWidth: '220px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {assignee ? (
        <span>
          {' '}
          <Avatar name={assignee.firstName} src={assignee.avatar} />
          <span style={{ flex: 1, fontSize: '14px', color: '#333' }}>
            {assignee.firstName} {assignee.lastName}
          </span>
        </span>
      ) : (
        'unassigned'
      )}
      <span style={{ fontSize: '12px', color: '#999' }}>▼</span>
    </div>
  );
};

export default AssigneeInput;
