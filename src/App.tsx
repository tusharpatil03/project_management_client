// import { SignUp } from './components/Auth/SignupTab';
import DashBoard from './pages/Dashboard/DashBoard';
import LandingPage from './pages/LandingPage/LandingPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import ProjectTable from './pages/Dashboard/Project/Projects';
import ProjectBoard from './pages/Dashboard/Project/ProjectBoard';
import SecuredRoutes from './components/SecuredRoutes/SecuredRoutes';
// import { useQuery } from '@apollo/client';
// import { CHECK_AUTH } from './graphql/Query/queries';
// import { useEffect } from 'react';
import CreateProject from './pages/Dashboard/Project/createProject';
import UserBoard from './pages/Dashboard/User/UserBoard';
import TeamBoard from './pages/Dashboard/Team/TeamBoard';
import EmailVerification from './pages/Auth/EmailVerification';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { useEffect } from 'react';
import { authState } from './utils/logout';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      authState.isAuthenticated = false;
      navigate('/', { replace: true });
    };

    window.addEventListener('app:logout', handleLogout);
    return () => window.removeEventListener('app:logout', handleLogout);
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/verify" element={<EmailVerification />} />

        <Route element={<SecuredRoutes />}>
          <Route path="/dashboard" element={<DashBoard />}>
            {/* Project Routes */}
            <Route path="projects" element={<ProjectBoard />} />
            <Route path="projects/all" element={<ProjectTable />} />
            <Route path="projects/new" element={<CreateProject />} />

            {/* User Routes */}
            <Route path="users" element={<UserBoard />} />

            {/* Team Routes */}
            <Route path="teams" element={<TeamBoard />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
