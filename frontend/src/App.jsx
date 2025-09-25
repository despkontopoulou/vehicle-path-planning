import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompareRoutePage from './pages/CompareRoutePage';
import SingleRoutePage from './pages/SingleRoutePage';
import CompareResultsPage from './pages/CompareResultsPage';
import SingleResultsPage from './pages/SingleResultsPage';
import MultiRoutePage from './pages/MultiRoutePage';
import MultiResultsPage from './pages/MultiResultsPage';
import CompareMultiRoutePage from './pages/CompareMultiRoutePage'
import CompareMultiResultsPage from './pages/CompareMultiResultsPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/single" element={<SingleRoutePage />} />
                <Route path="/single/results" element={<SingleResultsPage />} />

                <Route path="/compare" element={<CompareRoutePage />} />
                <Route path="/compare/results" element={<CompareResultsPage />} />

                <Route path="/multi" element={<MultiRoutePage />} />
                <Route path="/multi/results" element={<MultiResultsPage/>} />

                <Route path="/multi/compare" element={<CompareMultiRoutePage />} />
                <Route path="/multi/compare/results" element={<CompareMultiResultsPage />} />

                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
