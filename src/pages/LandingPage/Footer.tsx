import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <footer className="bg-blue-700 text-white py-16 text-center">
        <h3 className="text-3xl font-semibold mb-4">
          Ready to boost your productivity?
        </h3>
        <button
          onClick={() => {
            navigate('/auth');
          }}
          className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Create Your First Project
        </button>
      </footer>
    </>
  );
}

export default Footer;
