import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  path: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: 'fa-gauge' },
  { title: 'Inbox', path: '/dashboard/inbox', icon: 'fa-inbox', badge: 3 },
  { title: 'Users', path: '/dashboard/users', icon: 'fa-users' },
  { title: 'Create Project', path: '/dashboard/new', icon: 'fa-plus-circle' },
  { title: 'Projects', path: '/dashboard/all', icon: 'fa-folder-open' },
];

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  if (!isOpen) return null;

  return (
    <aside className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-6 w-64 transition-all duration-300 ease-in-out">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white px-2">
          Agile Board
        </h2>
      </div>
      <nav>
        <ul className="space-y-2 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ease-in-out
                                    ${
                                      location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
              >
                <div className="flex items-center gap-3">
                  <i
                    className={`fa-solid ${item.icon} ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  ></i>
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center justify-center text-xs font-semibold w-5 h-5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
