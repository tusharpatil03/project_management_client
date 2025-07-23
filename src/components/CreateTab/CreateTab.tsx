interface CreateTabProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const CreateTab: React.FC<CreateTabProps> = ({ title, onClose, children }) => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 mt-8 relative">
      {/* Cross button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {title}
      </h2>

      {children}
    </div>
  );
};

export default CreateTab;
