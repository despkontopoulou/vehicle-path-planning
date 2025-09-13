// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompareRoutePage from './pages/CompareRoutePage';
import OptimalRoutePage from './pages/OptimalRoutePage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/research" element={<CompareRoutePage />} />
                <Route path="/route" element={<OptimalRoutePage />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
