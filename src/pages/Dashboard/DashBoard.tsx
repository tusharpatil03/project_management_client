import { Outlet } from 'react-router-dom';
import Navbar from '../../components/DashBoard/Navbar';
import { Sidebar } from '../../components/DashBoard/Sidebar';
import { useState } from 'react';
import Loader from '../../components/Loader';

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoader(false);
  //   }, 700);
  // }, []);

  return false ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Loader size="xl" />
    </div>
  ) : (
    <div className="flex h-screen flex-col bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex-1 overflow-auto transition-all duration-300 ">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
