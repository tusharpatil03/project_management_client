import { Search, User, UserPlus } from 'lucide-react';
import { InterfaceUser } from '../../types';
import LoadingState from '../LoadingState';
import { useMessage } from '../ShowMessage';
import Avatar from '../Profile/Avatar';

interface ChildProps {
  members: InterfaceUser[] | undefined;
  handleClick: (id: string) => void;
  loading: boolean;
  error: string | undefined;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Members: React.FC<ChildProps> = ({
  members,
  handleClick,
  loading,
  error,
  searchTerm,
  onSearchChange,
}) => {
  const filteredMembers =
    members?.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const { showError } = useMessage();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingState size="sm" fullScreen={false} />
      </div>
    );
  }

  if (error) {
    showError(error);
    return null;
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No team members found</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    onSearchChange(value);
  };

  if (filteredMembers.length === 0) {
    return (
      <div onChange={handleChange} className="text-center py-8">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No members match your search</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredMembers.map((user) => (
        <div
          key={user.id}
          onClick={() => handleClick(user.id)}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all group"
        >
          <Avatar name={user.firstName} src={user.profile?.avatar || ''} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              {user.firstName} {user.lastName}
            </p>
            {user.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
          </div>
          <UserPlus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
};

export default Members;
