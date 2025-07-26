interface ChildProps {
  handleDelete: () => void;
  setDeleteTab: (value: boolean) => void;
  loading: any;
}

const DeleteTab: React.FC<ChildProps> = ({
  handleDelete,
  setDeleteTab,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg flex items-center gap-4">
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={() => setDeleteTab(false)}
        className="text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
};

export default DeleteTab;