
const UserBoard = () => {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 User Board</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default UserBoard;
