import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompareRoutePage from './pages/CompareRoutePage';
import SingleRoutePage from './pages/SingleRoutePage';
import CompareResultsPage from './pages/CompareResultsPage';
import SingleResultsPage from './pages/SingleResultsPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/compare" element={<CompareRoutePage />} />
                <Route path="/single" element={<SingleRoutePage />} />
                <Route path="/compare/results" element={<CompareResultsPage />} />
                <Route path="/single/results" element={<SingleResultsPage />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
