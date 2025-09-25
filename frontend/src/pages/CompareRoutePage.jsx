import PointSelectionPage from './PointSelectionPage';
import { useNavigate } from 'react-router-dom';

export default function CompareRoutePage() {
    const navigate = useNavigate();
    const handlePointsSelected = (start, end, profile) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        navigate(`/compare/results?start=${startQ}&end=${endQ}&profile=${profile}`);
    };
    return <PointSelectionPage onPointsSelected={handlePointsSelected} mode="compare" />;
}