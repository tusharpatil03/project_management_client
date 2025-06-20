import { useState } from 'react';
import Navbar from '../../components/DashBoard/Navbar';
import { Sidebar } from '../../components/DashBoard/Sidebar';

function Navigate() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    console.log(isOpen);

    return (
        <div>
            <Navbar onChange={toggleSidebar} />
            <Sidebar isOpen={isOpen} />
            
        </div>
    );
}

export default Navigate;


