import { useEffect, useState } from 'react';
import { AuthTab } from '../../components/Auth/AuthTab';
import Navbar from '../../components/Navbar';
import LoadingState from '../../components/LoadingState';
import Demo from './Demo';
import Footer from './Footer';
import Features from './Features';
import Hero from './Hero';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LandingPage = () => {
  const [tab, setTab] = useState<boolean>(false);
  const auth = useAuth();
  const isLoggedIn = auth.isAuthenticated;

  // const location = useLocation();
  // console.log(location);
  // if (location.pathname === '/login' && tab === false) {
  //   setTab(true);
  // }

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    setTab((prev) => !prev);
  };

  const [loaderComponent, setLoaderComponent] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/projects', { replace: true });
    } else {
      const timer = setTimeout(() => {
        setLoaderComponent(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  return loaderComponent ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoadingState size="xl" fullScreen={false} />
    </div>
  ) : (
    <div>
      <Navbar onChange={handleClick} />
      <Demo />
      <div className="relative z-0">
        <div className="font-sans">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white min-h-screen flex flex-col justify-center items-center text-center px-6">
            <Hero />
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gray-100 text-center px-4"></section>
          <Features />
          <section>
            <Footer />
          </section>
        </div>
        <div className={tab ? '' : 'hidden z-0'}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
            <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-2 w-full max-w-md relative">
              <button
                onClick={handleClick}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition duration-200"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <AuthTab />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
