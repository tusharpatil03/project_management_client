import DashBoard from './screens/DashBoard/index';
import LandingPage from './screens/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>

                    <Route path="/projects" element={<DashBoard />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
