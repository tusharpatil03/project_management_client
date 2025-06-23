import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Simplify Your Project Management
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8">
                Manage tasks, collaborate with your team, and get things done
                faster. Everything you need — all in one place.
            </p>
            <div>
                <button
                    onClick={() => {
                        navigate('/auth');
                    }}
                    className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
                >
                    Get Started
                </button>
            </div>
        </>
    );
};

export default Hero;
