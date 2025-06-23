import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
    const [shouldRender, setShouldRender] = useState<boolean>(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            // Wait for animation to finish before unmounting
            const timeout = setTimeout(() => setShouldRender(false), 300); // match transition duration
            return () => clearTimeout(timeout);
        }
    }, []);

    if (!shouldRender) return null;
    return (
        <aside
            id="logo-sidebar"
            className={`
                fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link
                            to="/dashboard"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            {/* ...icon... */}
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                Dashboard
                            </span>
                        </Link>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                Inbox
                            </span>
                            <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                3
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                Users
                            </span>
                        </a>
                    </li>

                    <li>
                        <Link
                            to="/dashboard/new"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            {/* ...icon... */}
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                Create Project
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/all"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            {/* ...icon... */}
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                Projects
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};
