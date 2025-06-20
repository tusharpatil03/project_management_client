import { SignUp } from './components/Auth/SignupTab';
import DashBoard from './pages/DashBoard/DashBoard';
import LandingPage from './pages/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Project from './pages/DashBoard/Project/createProject';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/register" element={<SignUp />}></Route>
                    <Route path="/dashboard" element={<DashBoard />}></Route>
                    <Route path="/project" element={<Project />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
