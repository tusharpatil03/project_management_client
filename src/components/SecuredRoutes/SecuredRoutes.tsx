import { JSX } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const SecuredRoutes = (): JSX.Element => {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    const project = localStorage.getItem('projectId');

    const navigate = useNavigate();

    return isLoggedIn === 'TRUE' ? <Outlet /> : <Navigate to="/" replace />;
};

const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;
let lastActive: number = Date.now();

document.addEventListener('mousemove', () => {
    lastActive = Date.now();
});

setInterval(() => {
    const currentTime = Date.now();
    const timeSinceLastActive = currentTime - lastActive;

    if (timeSinceLastActive > timeoutMilliseconds) {
        console.warn('Kindly relogin as sessison has expired');

        window.location.href = '/';
        localStorage.setItem('IsLoggedIn', 'FALSE');
    }
}, inactiveIntervalMilsec);

export default SecuredRoutes;
