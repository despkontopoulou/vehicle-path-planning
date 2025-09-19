import PointSelectionPage from './PointSelectionPage';
import { useNavigate } from 'react-router-dom';

export default function OptimalRoutePage() {
    const navigate = useNavigate();
    const handlePointsSelected = (start, end, profile) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        navigate(`/optimal/results?start=${startQ}&end=${endQ}&profile=${profile}`);
    };
    return <PointSelectionPage onPointsSelected={handlePointsSelected} mode="optimal" />;
}