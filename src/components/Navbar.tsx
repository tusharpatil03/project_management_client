import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // optional: install lucide-react

const Navbar = ({ onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b shadow-sm fixed top-0 w-full z-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TaskFlow
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-600">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </Link>
            <Link
              onClick={onChange}
              to="/"
              className="text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Sign In
            </Link>
            <Link
              onClick={onChange}
              to="/auth"
              className="text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-8">
            <Link
              onClick={onChange}
              to="/"
              className="text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Sign In
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="block text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            Pricing
          </Link>
          <Link
            to="/"
            className="block text-blue-600 border border-blue-600 px-4 py-2 rounded text-sm text-center hover:bg-blue-50"
            onClick={toggleMenu}
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="block text-white bg-blue-600 px-4 py-2 rounded text-sm text-center hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
