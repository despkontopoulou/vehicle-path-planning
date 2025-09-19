import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { compareRoutes } from '../api/routingApi';
import MapView from '../components/map/MapView';

function parseLatLng(param) {
    if (!param) return null;
    const [lat, lng] = param.split(',').map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

export default function CompareResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);

    const [routes, setRoutes] = useState([]);
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
            endLat: end.lat,
            endLon: end.lng
        })
            .then((data) => {
                const entries = Object.entries(data.routes ?? {});
                const mapped = entries.map(([name, r]) => ({
                    name,
                    points: (r.path ?? []).map(p => [p.lat, p.lon]),
                    totalDistanceKm: r.totalDistance,
                    totalTimeSec: r.totalTime
                }));
                setRoutes(mapped);
            })
            .catch(e => setErr(e.message || 'Request failed'))
            .finally(() => setLoading(false));
    }, [start, end]);

    if (loading) return <div>Loading results…</div>;
    if (err) return <div>Error: {err}</div>;
    if (!routes.length) return <div>No routes found</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Compare Results</h2>

            {routes.map((r, idx) => (
                <div key={r.name} style={{ marginBottom: 40 }}>
                    <h3>{r.name}</h3>
                    <MapView start={start} end={end} routes={[r]} index={idx} />
                    <p>
                        Distance: {r.totalDistanceKm?.toFixed(2)} km, Time: {Math.round(r.totalTimeSec)} s
                    </p>
                </div>
            ))}
        </div>
    );
}
