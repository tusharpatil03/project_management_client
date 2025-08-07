import { useState } from "react";
import Navbar from "../../components/DashBoard/Navbar";
import { Sidebar } from "../../components/DashBoard/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 max-w-100 overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;