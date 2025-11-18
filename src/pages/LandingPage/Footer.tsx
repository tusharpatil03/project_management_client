import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-semibold text-white mb-2">Ready to boost your productivity?</h3>
          <p className="text-gray-400 text-sm">Collaborate faster, plan better, and deliver on time.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow hover:scale-105 transition"
          >
            Create Your First Project
          </button>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div>© 2024 Agile, Inc. All rights reserved.</div>
          <div className="flex items-center gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
