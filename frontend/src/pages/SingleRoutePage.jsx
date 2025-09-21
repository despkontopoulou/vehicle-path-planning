import PointSelectionPage from './PointSelectionPage';
import { useNavigate } from 'react-router-dom';

export default function SingleRoutePage() {
    const navigate = useNavigate();
    const handlePointsSelected = (start, end, profile, algorithm) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        navigate(`/single/results?start=${startQ}&end=${endQ}&profile=${profile}&algorithm=${algorithm}`);
    };
    return <PointSelectionPage onPointsSelected={handlePointsSelected} mode="single" />;
}