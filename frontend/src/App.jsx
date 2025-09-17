import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompareRoutePage from './pages/CompareRoutePage';
import OptimalRoutePage from './pages/OptimalRoutePage';
import CompareResultsPage from './pages/CompareResultsPage';
import OptimalResultsPage from './pages/OptimalResultsPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/compare" element={<CompareRoutePage />} />
                <Route path="/optimal" element={<OptimalRoutePage />} />
                <Route path="/compare/results" element={<CompareResultsPage />} />
                <Route path="/optimal/results" element={<OptimalResultsPage />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
