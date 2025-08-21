import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDashboard } from '../../pages/Dashboard/DashBoard';
import Loader from '../Loader';

interface BaseNavItem {
  title: string;
  path: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

interface StaticNavItem extends BaseNavItem {
  type: 'static';
  subItems?: NavItem[];
}

interface DynamicNavItem extends BaseNavItem {
  type: 'dynamic';
  dataKey: 'recentProjects' | 'starredProjects';
  maxItems?: number;
  emptyMessage?: string;
}

interface ProjectNavItem extends BaseNavItem {
  type: 'project';
  projectId: string;
}

type NavItem = StaticNavItem | DynamicNavItem | ProjectNavItem;

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { recentProjects, starredProjects, user, loading } = useDashboard();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  const navItems: NavItem[] = useMemo(() => {
    const userId = user?.id || 'current';

    return [
      {
        type: 'static',
        title: 'Dashboard',
        path: '/projects',
        icon: 'fa-gauge',
      },
      {
        type: 'static',
        title: 'Peoples',
        path: '/peoples',
        icon: 'fa-users',
      },
      {
        type: 'static',
        title: 'Teams',
        path: '/people/teams',
        icon: 'fa-user-group',
      },
      {
        type: 'static',
        title: 'Profile',
        path: `/people/${userId}/profile`,
        icon: 'fa-user-circle',
      },
      {
        type: 'static',
        title: 'Inbox',
        path: `/people/${userId}/inbox`,
        icon: 'fa-inbox',
        badge: 29,
      },
      {
        type: 'static',
        title: 'Projects',
        path: '/projects',
        icon: 'fa-folder-open',
        subItems: [
          {
            type: 'static',
            title: 'All Projects',
            path: '/projects/list',
            icon: 'fa-list',
          },
          {
            type: 'dynamic',
            title: 'Recent Projects',
            path: '/projects/recent',
            icon: 'fa-clock',
            dataKey: 'recentProjects',
            maxItems: 5,
            emptyMessage: 'No recent projects',
          },
          {
            type: 'dynamic',
            title: 'Starred Projects',
            path: '/projects/starred',
            icon: 'fa-star',
            dataKey: 'starredProjects',
            maxItems: 5,
            emptyMessage: 'No starred projects',
          },
        ],
      },
      {
        type: 'static',
        title: 'Create Project',
        path: '/projects/create',
        icon: 'fa-plus',
      },
    ];
  }, [user?.id]);

  useEffect(() => {
    const expandParentItems = () => {
      const newExpandedItems: string[] = [];

      const checkItemAndSubItems = (item: NavItem): boolean => {
        if (item.type === 'static' && item.subItems) {
          const hasActiveChild = item.subItems.some((subItem) => {
            if (subItem.type === 'static') {
              return location.pathname === subItem.path;
            } else if (subItem.type === 'dynamic') {
              const projects =
                subItem.dataKey === 'recentProjects'
                  ? recentProjects
                  : starredProjects;
              return projects.some(
                (project) => location.pathname === `/projects/${project.id}`
              );
            }
            return false;
          });

          if (hasActiveChild && !newExpandedItems.includes(item.path)) {
            newExpandedItems.push(item.path);
          }

          return hasActiveChild;
        }
        return location.pathname === item.path;
      };

      navItems.forEach(checkItemAndSubItems);

      if (newExpandedItems.length > 0) {
        setExpandedItems((prev) => [
          ...prev.filter((path) => !newExpandedItems.includes(path)),
          ...newExpandedItems,
        ]);
      }
    };

    expandParentItems();
  }, [currentPath, recentProjects, starredProjects]);

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

  const isActiveRoute = (item: NavItem): boolean => {
    if (item.type === 'static') {
      if (location.pathname === item.path) return true;

      if (item.subItems) {
        return item.subItems.some((subItem) => {
          if (subItem.type === 'static') {
            return location.pathname === subItem.path;
          } else if (subItem.type === 'dynamic') {
            const projects =
              subItem.dataKey === 'recentProjects'
                ? recentProjects
                : starredProjects;
            return projects.some(
              (project) => location.pathname === `/projects/${project.id}`
            );
          }
          return false;
        });
      }
    } else if (item.type === 'project') {
      return location.pathname === `/projects/${item.projectId}`;
    }

    return false;
  };
  const renderDynamicSubItems = (item: DynamicNavItem) => {
    const projects =
      item.dataKey === 'recentProjects' ? recentProjects : starredProjects;
    const limitedProjects = item.maxItems
      ? projects.slice(0, item.maxItems)
      : projects;

    if (loading) {
      return (
        <li className="px-2.5 py-1.5">
          <div className="flex items-center gap-3">
            <Loader size="lg" />
          </div>
        </li>
      );
    }

    if (limitedProjects.length === 0) {
      return (
        <li className="px-2.5 py-1.5 text-xs text-gray-400 dark:text-gray-500">
          {item.emptyMessage || 'No items'}
        </li>
      );
    }
    return (
      <>
        {limitedProjects.map((project) => (
          <li key={project.id}>
            <Link
              to={`/projects/${project.id}`}
              onClick={() => window.innerWidth < 1024 && onClose?.()}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group ${
                location.pathname === `/projects/${project.id}`
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-l-4 border-blue-500'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={project.name}
            >
              <i
                className={`fa-solid fa-folder w-4 text-center text-xs ${
                  location.pathname === `/projects/${project.id}`
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                }`}
              />
              <span className="text-sm truncate flex-1">{project.name}</span>
              {item.dataKey === 'starredProjects' && (
                <i className="fa-solid fa-star text-xs text-yellow-500"></i>
              )}
            </Link>
          </li>
        ))}
      </>
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = isActiveRoute(item);
    const isExpanded = expandedItems.includes(item.path);

    if (item.type === 'static' && item.subItems) {
      return (
        <div>
          <button
            onClick={() => toggleExpanded(item.path)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <i
                className={`fa-solid ${item.icon} w-5 text-center ${
                  isActive
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
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="ml-6 space-y-1">
              {item.subItems.map((subItem) => (
                <li key={subItem.path}>
                  {subItem.type === 'static' ? (
                    <Link
                      to={subItem.path}
                      onClick={() => window.innerWidth < 1024 && onClose?.()}
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
                  ) : subItem.type === 'dynamic' ? (
                    <div>
                      <div className="flex items-center gap-3 p-2.5 text-gray-500 dark:text-gray-400">
                        <i
                          className={`fa-solid ${subItem.icon} w-4 text-center text-xs`}
                        />
                        <span className="text-sm font-medium">
                          {subItem.title}
                        </span>
                      </div>
                      <ul className="ml-6 space-y-1">
                        {renderDynamicSubItems(subItem)}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <Link
        to={item.path}
        onClick={() => window.innerWidth < 1024 && onClose?.()}
        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
        } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-3">
          <i
            className={`fa-solid ${item.icon} w-5 text-center ${
              isActive
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
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`relative inset-y-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          {/* <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Agile Board
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
            </button>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.title}>{renderNavItem(item)}</li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};