interface CreateTabProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const CreateTab: React.FC<CreateTabProps> = ({ title, onClose, children }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white p-6 sm:p-8 overflow-y-auto rounded-xl shadow-xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-blue-800 mb-4 sm:mb-6">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};
export default CreateTab;
