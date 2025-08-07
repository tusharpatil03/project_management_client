import Loader from './Loader';

const LoadingState = ({ size }: { size: 'sm' | 'lg' | 'xl' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader size={size} />
    </div>
  </div>
);

export default LoadingState;
