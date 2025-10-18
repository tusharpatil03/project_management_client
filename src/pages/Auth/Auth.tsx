import authPageImage from '../../assets/authPageImage.png';
import { AuthTab } from './AuthTab';

function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Image Section */}
        <div className="md:w-[55%] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-10 relative">
          <img
            src={authPageImage}
            alt="Authentication Visual"
            className="w-[90%] max-w-[600px] rounded-[30px] shadow-2xl transform rotate-3 hover:rotate-1 transition-all duration-500 ease-in-out object-cover"
          />
        </div>

        {/* Auth Tab Section */}
        <div className="md:w-[45%] flex items-center justify-center bg-white p-10">
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
              Welcome to Agile Platform
            </h2>
            <AuthTab/>
            <p className="text-sm text-gray-400 mt-6 text-center italic">
              Empowering your productivity with agility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
