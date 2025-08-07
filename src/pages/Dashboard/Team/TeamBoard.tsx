// src/pages/dashboard/teams/TeamBoard.tsx
import { useNavigate } from 'react-router-dom';

const teams = [
  { id: 'team-1', name: 'Backend Team' },
  { id: 'team-2', name: 'Frontend Team' },
];

const TeamBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Team Board</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Team Name</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-t">
              <td className="py-2 px-4">{team.name}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => navigate(`/people/${team.id}`)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamBoard;
