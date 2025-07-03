// import { SignUp } from './components/Auth/SignupTab';
import DashBoard from './pages/Home/DashBoard';
import LandingPage from './pages/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import ProjectTable from './pages/Home/Project/allProjects';
import ProjectDashboard from './pages/Home/Project/Project';
import SecuredRoutes from './components/SecuredRoutes/SecuredRoutes';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from './graphql/Query/queries';
import { useEffect } from 'react';
import CreateProject from './pages/Home/Project/createProject';
import ProjectRoutes from './components/ProjectRoutes/ProjectRoutes';

function App() {
    const { data, loading } = useQuery(CHECK_AUTH);

    useEffect(() => {
        if (data) {
            localStorage.setItem(
                'name',
                `${data.checkAuth.firstName} ${data.checkAuth.lastName}`
            );
            localStorage.setItem('id', data.checkAuth._id);
            localStorage.setItem('email', data.checkAuth.email);
            localStorage.setItem('IsLoggedIn', 'TRUE');
            localStorage.setItem('FirstName', data.checkAuth.firstName);
            localStorage.setItem('LastName', data.checkAuth.lastName);
            localStorage.setItem('avtar', data.checkAuth.profile.image);
            localStorage.setItem('username', data.checkAuth.username);
        }
    }, [data, loading]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />

                    <Route element={<SecuredRoutes />}>
                        <Route path="/dashboard" element={<DashBoard />}></Route>

                        <Route path="/project"> 
                        <Route index element={<ProjectDashboard />} ></Route>
                        <Route path="all" element={<ProjectTable />} ></Route>
                        <Route path="create" element={<CreateProject />}></Route></Route>
                       
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
