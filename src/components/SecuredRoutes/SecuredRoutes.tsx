import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SecuredRoutes: React.FC = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  useEffect(() => {
    const handleLogout = () => {
      // ensure provider state is cleared
      auth.signOut();
      navigate('/', { replace: true });
    };

    window.addEventListener('app:logout', handleLogout);
    return () => window.removeEventListener('app:logout', handleLogout);
  }, [navigate, auth]);

  const isAuthenticated = auth.isAuthenticated;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// const timeoutMinutes = 15;
// const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

// const inactiveIntervalMin = 1;
// const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;
// let lastActive: number = Date.now();

// document.addEventListener('mousemove', () => {
//   lastActive = Date.now();
// });

// setInterval(() => {
//   const currentTime = Date.now();
//   const timeSinceLastActive = currentTime - lastActive;

//   if (timeSinceLastActive > timeoutMilliseconds) {
//     console.warn('Kindly relogin as sessison has expired');
//     // Use a logout event so all parts of the app respond consistently
//     window.dispatchEvent(new Event('app:logout'));
//   }
// }, inactiveIntervalMilsec);

export default SecuredRoutes;
