import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  path: string;
  icon: string;
  badge?: number;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/projects', icon: 'fa-gauge' },
  {
    title: 'Inbox',
    path: '/people/:',
    icon: 'fa-inbox',
    badge: 3,
  },
  { title: 'Users', path: '/dashboard/users', icon: 'fa-users' },
  {
    title: 'Projects',
    path: '/dashboard/projects',
    icon: 'fa-folder-open',
    subItems: [
      { title: 'All Projects', path: '/dashboard/all', icon: 'fa-list' },
      { title: 'Create Project', path: '/dashboard/new', icon: 'fa-plus' },
      { title: 'Archived', path: '/dashboard/archived', icon: 'fa-archive' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);


  // Auto-expand parent items if child is active
  useEffect(() => {
    navItems.forEach((item) => {
      if (
        item.subItems?.some((subItem) => location.pathname === subItem.path)
      ) {
        setExpandedItems((prev) =>
          prev.includes(item.path) ? prev : [...prev, item.path]
        );
      }
    });
  }, [location.pathname]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path)
        ? prev.filter((item) => item !== path)
        : [...prev, path]
    );
  };

  const isActiveRoute = (path: string, subItems?: NavItem[]) => {
    if (location.pathname === path) return true;
    return (
      subItems?.some((subItem) => location.pathname === subItem.path) || false
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Agile Board
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.subItems ? (
                    // Expandable Item
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.path)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left ${
                          isActiveRoute(item.path, item.subItems)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={`fa-solid ${item.icon} w-5 text-center ${
                              isActiveRoute(item.path, item.subItems)
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="inline-flex items-center justify-center text-xs font-semibold w-5 h-5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          <i
                            className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${
                              expandedItems.includes(item.path)
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedItems.includes(item.path)
                            ? 'max-h-96 opacity-100 mt-1'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="ml-6 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                onClick={() =>
                                  window.innerWidth < 1024 && onClose?.()
                                }
                                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                                  location.pathname === subItem.path
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-l-4 border-blue-500'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <i
                                  className={`fa-solid ${subItem.icon} w-4 text-center text-xs ${
                                    location.pathname === subItem.path
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-400 dark:text-gray-500'
                                  }`}
                                />
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    // Regular Item
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && onClose?.()}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i
                          className={`fa-solid ${item.icon} w-5 text-center ${
                            location.pathname === item.path
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center text-xs font-semibold w-5 h-5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
