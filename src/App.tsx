import DashBoard from './screens/DashBoard'
import LandingPage from './screens/LandingPage'
import { SignPage } from './screens/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/auth" element={<SignPage />}></Route>
                    <Route path="/projects" element={<DashBoard />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
