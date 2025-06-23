import { SignUp } from './components/Auth/SignupTab';
import DashBoard from './pages/DashBoard/DashBoard';
import LandingPage from './pages/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import ProjectTable from './pages/DashBoard/Project/allProjects';
import CreateProject from './pages/DashBoard/Project/createProject';
import ProjectDashboard from './pages/DashBoard/Project/Project'; // Add this import

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<DashBoard />}>
                        <Route index element={<ProjectDashboard />} /> {/* Dashboard overview */}
                        <Route path="projects" element={<ProjectTable />} />
                        <Route path="new" element={<CreateProject />} />
                        <Route path="all" element={<ProjectTable />} />
                        {/* <Route path="team" element={<TeamComponent />} /> */}
                        {/* <Route path="user" element={<UserComponent />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
