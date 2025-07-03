import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/DashBoard/Sidebar';
import { useState } from 'react';

const DashBoard = (): React.ReactElement => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    console.log(isOpen);

    return (
        <div>
            <Navbar onChange={toggleSidebar} />
            <Sidebar isOpen={isOpen} />
            <Outlet/>
        </div>
    );
};

export default DashBoard;
