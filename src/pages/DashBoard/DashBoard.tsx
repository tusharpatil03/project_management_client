import { Outlet } from 'react-router-dom';
import Navigate from './Navigate';

const DashBoard = (): React.ReactElement => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigate />
            <div className="p-4 sm:ml-64 mt-16">
                <div className="max-w-7xl mx-auto space-y-6">
                    <header className="bg-white shadow rounded-lg px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Overview of your projects
                        </p>
                    </header>
                    <Outlet /> {/* Nested routes render here */}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
