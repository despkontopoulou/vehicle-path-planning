// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResearchPage from './pages/ResearchPage';
import RoutePage from './pages/RoutePage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/route" element={<RoutePage />} />
            </Routes>
        </BrowserRouter>
    );
}
