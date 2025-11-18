import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
        Simplify Your Project Management
      </h1>
      <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-100 mb-8 leading-relaxed">
        Manage tasks, collaborate with your team, and get things done faster.
        Everything you need — all in one place.
      </p>
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            navigate('/auth');
          }}
          className="inline-flex items-center gap-3 bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <span>Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
