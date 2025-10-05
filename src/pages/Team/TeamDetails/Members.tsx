import React from 'react';
import { UserTeam } from '../../../types';
import { MemberCard } from '../Team';
import { Users } from 'lucide-react';

// interface MembersProps {
//   members: Member[];
// }
// const Members: React.FC<MembersProps> = ({ members }) => {
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">All Team Members</h2>

//       {/* Other Members */}
//       {members.length > 0 && (
//         <div>
//           <h3 className="text-lg font-medium mb-3">
//             Team Members ({members.length})
//           </h3>
//           <div className="grid gap-3 md:grid-cols-2">
//             {members.map((member) => (
//               <MemberCard key={member.id} teamUser={member} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Members;

const MembersTab = ({
  users,
  creator,
  currentUserId,
  onRemove,
}: {
  users: UserTeam[];
  creator: UserTeam;
  currentUserId: string;
  onRemove: (memberId: string) => void;
}) => {

  // console.log('member: ', users);
  
  return (
    <div className="p-6">
      {creator && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Team Creator
          </h2>
          <MemberCard
            key={creator.id}
            teamUser={creator}
            isCreator={true}
            isCurrentUser={creator.id === currentUserId}
            onRemove={onRemove}
            showRemove={false}
          />
        </div>
      )}

      {users.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Team Members ({users.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((member) => (
              <MemberCard
                key={member.id}
                teamUser={member}
                isCreator={false}
                isCurrentUser={member.id === currentUserId}
                onRemove={onRemove}
                showRemove={true}
              />
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No other members yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Add team members to start collaborating
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersTab;
