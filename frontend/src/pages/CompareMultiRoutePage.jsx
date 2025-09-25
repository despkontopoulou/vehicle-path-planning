import { useNavigate } from 'react-router-dom';
import PointSelectionPage from './PointSelectionPage';

export default function CompareMultiRoutePage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end, waypoints, profile) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        const viaQ = waypoints.map(wp => `viaLat=${wp.lat}&viaLon=${wp.lng}`).join('&');

        navigate(`/multi/compare/results?start=${startQ}&end=${endQ}&${viaQ}&profile=${profile}`);
    };

    return <PointSelectionPage mode="multiCompare" onPointsSelected={handlePointsSelected} />;
}
