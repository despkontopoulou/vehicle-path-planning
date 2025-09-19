import { useSearchParams } from 'react-router-dom';
import { compareRoutes } from '../api/routingApi';
import { useEffect, useMemo, useState } from 'react';
import MapView from '../components/map/MapView';
import StatsTable from '../components/stats/StatsTable';

function parseLatLng(param) {
    if (!param) return null;
    const [lat, lng] = param.split(',').map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    return null;
}

export default function CompareResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        if (!start || !end) {
            setErr('Missing start or end coordinates');
            setLoading(false);
            return;
        }
        setLoading(true);
        compareRoutes({
            startLat: start.lat,
            startLon: start.lng,
            goalLat: end.lat,
            goalLon: end.lng
        })
            .then(setData)
            .catch(e => setErr(e.message || 'Request failed'))
            .finally(() => setLoading(false));
    }, [start, end]);

    if (loading) return <div>Loading results…</div>;
    if (err) return <div>Error: {err}</div>;
    if (!data || !data.routes) return <div>No data</div>;

    // 🔹 Transform backend response into frontend route objects
    const routes = Object.entries(data.routes).map(([name, result]) => ({
        name,
        points: (result.path || []).map(p => [p.lat, p.lon]),
        totalDistance: result.totalDistance,
        totalTime: result.totalTime
    }));

    return (
        <div style={{ padding: 20 }}>
            <h2>Compare Results</h2>
            <MapView start={start} end={end} routes={routes} />
            <StatsTable results={routes} />
        </div>
    );
}
