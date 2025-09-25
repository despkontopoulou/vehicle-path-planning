import { useNavigate } from 'react-router-dom';
import PointSelectionPage from './PointSelectionPage';

export default function MultiRoutePage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end, waypoints, profile, algorithm) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        const viaQ = waypoints.map(wp => `viaLat=${wp.lat}&viaLon=${wp.lng}`).join('&');

        navigate(`/multi/results?start=${startQ}&end=${endQ}&${viaQ}&profile=${profile}&algorithm=${algorithm}`);
    };

    return <PointSelectionPage mode="multi" onPointsSelected={handlePointsSelected} />;
}
