import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-800/95 dark:border-gray-700">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <i
                className={`fa-solid transition-transform duration-200 ${
                  isSidebarOpen ? 'fa-times' : 'fa-bars'
                } text-gray-700 dark:text-gray-300`}
              ></i>
            </button>

            <Link to="/projects" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <i className="fa-solid fa-tasks text-white text-sm"></i>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search projects, issues..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i className="fa-solid fa-search text-gray-700 dark:text-gray-300"></i>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i className="fa-solid fa-bell text-gray-700 dark:text-gray-300"></i>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                type="button"
                className="flex items-center space-x-2 text-sm rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <img
                  className="w-8 h-8 rounded-lg object-cover"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="User profile"
                />
                <span className="hidden lg:block text-gray-700 dark:text-gray-300 font-medium">
                  Neil Sims
                </span>
                <i
                  className={`hidden lg:block fa-solid fa-chevron-down text-xs text-gray-500 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>

              <UserMenuTab
                isOpen={isUserMenuOpen}
                onClose={() => setUserMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface UserMenuTabProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenuTab = ({ isOpen, onClose }: UserMenuTabProps) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Profile', path: '/profile', icon: 'fa-user' },
    { label: 'Settings', path: '/settings', icon: 'fa-cog' },
    { label: 'Help & Support', path: '/help', icon: 'fa-question-circle' },
    { label: 'Sign out', path: '/logout', icon: 'fa-sign-out-alt' },
  ];

  return (
    <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50 animate-in slide-in-from-top-2 duration-200">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            className="w-10 h-10 rounded-lg object-cover"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="User profile"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Neil Sims
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              neil.sims@flowbite.com
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={onClose}
            className={`flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
              index === menuItems.length - 1
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : ''
            }`}
          >
            <i
              className={`fa-solid ${item.icon} w-4 mr-3 ${
                index === menuItems.length - 1
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            ></i>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
