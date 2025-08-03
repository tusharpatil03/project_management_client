import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { authState } from '../../authManager';
import { useEffect } from 'react';

const SecuredRoutes: React.FC = () => {
  const isAuthenticated = authState.isAuthenticated;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
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
  }
}, inactiveIntervalMilsec);

export default SecuredRoutes;
