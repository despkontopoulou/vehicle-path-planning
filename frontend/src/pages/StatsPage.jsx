import { useNavigate } from 'react-router-dom';
import PointSelectionPage from './PointSelectionPage';

export default function StatsPage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end, waypoints, vehicles, profiles, algorithms) => {
        const startQ = `${start.lat},${start.lng}`;
        const endQ = `${end.lat},${end.lng}`;
        const viaQ = waypoints.map(wp => `viaLat=${wp.lat}&viaLon=${wp.lng}`).join('&');

        const vQ = vehicles.map(v => `vehicles=${v}`).join('&');
        const pQ = profiles.map(p => `profiles=${p}`).join('&');
        const aQ = algorithms.map(a => `algorithms=${a}`).join('&');

        navigate(`/stats/results?start=${startQ}&end=${endQ}&${viaQ}&${vQ}&${pQ}&${aQ}`);
    };

    return <PointSelectionPage mode="stats" onPointsSelected={handlePointsSelected} />;
}
