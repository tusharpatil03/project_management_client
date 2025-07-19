import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white shadow-md">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              type="button"
              className="p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <i className="fa-solid fa-bars text-gray-700"></i>
            </button>

            <Link to="/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="TaskFlow Logo"
              />
              <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">
                TaskFlow
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative ml-3">
              <button
                onClick={toggleUserMenu}
                type="button"
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="border-2 border-transparent rounded-full hover:border-gray-200 transition-all">
                  <img
                    className="w-9 h-9 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="User profile"
                  />
                </div>
              </button>

              <UserMenuTab isOpen={isUserMenuOpen} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const UserMenuTab = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">Neil Sims</p>
        <p className="text-sm text-gray-500 truncate mt-1">
          neil.sims@flowbite.com
        </p>
      </div>

      <div className="py-1">
        {[
          { label: 'Dashboard', path: '/' },
          { label: 'Settings', path: '/' },
          { label: 'Earnings', path: '/' },
          { label: 'Sign out', path: '/' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            role="menuitem"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
