import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { singleRoute } from '../api/routingApi';
import MapView from '../components/map/MapView';
import StatsTable from '../components/stats/StatsTable';
import '../styling/SingleResults.css';

function parseLatLng(param) {
    if (!param) return null;
    const [lat, lng] = param.split(',').map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

export default function SingleResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);
    const profile = sp.get('profile') || 'car_fastest';
    const algorithm = sp.get('algorithm') || 'astar';

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const ALGO_LABELS = {
        astar: "A*",
        astarbi: "A* Bidirectional",
        dijkstra: "Dijkstra",
        dijkstrabi: "Dijkstra Bidirectional"
    };

    useEffect(() => {
        if (!start || !end) {
            setErr('Missing start or end coordinates');
            setLoading(false);
            return;
        }

        setLoading(true);
        singleRoute({
            startLat: start.lat,
            startLon: start.lng,
            endLat: end.lat,
            endLon: end.lng,
            profile,
            algorithm
        })
            .then((data) => {
                setRoute({
                    name: algorithm,
                    points: (data.path ?? []).map(p => [p.lat, p.lon]),
                    totalDistanceKm: data.totalDistance,
                    totalTimeSec: data.totalTime,
                    computationTimeMs: (data.computationTimeNs ?? 0) / 1e6,
                    exploredNodes: data.exploredNodes ?? 0,
                    pointsCount: data.pointsCount
                });
            })
            .catch(e => setErr(e.message || 'Request failed'))
            .finally(() => setLoading(false));
    }, [start, end, profile, algorithm]);

    if (loading) return <div className="status-message">Loading route…</div>;
    if (err) return <div className="status-message">Error: {err}</div>;
    if (!route) return <div className="status-message">No route found</div>;

    return (
        <div className="single-results-page">
            <h2 className="section-title">Route Result</h2>

            <div className="single-result-card">
                <div className="result-header">
                    <h3>
                        {ALGO_LABELS[algorithm] || algorithm} ·{" "}
                        {profile === "car_fastest" ? "Fastest Routing" : "Shortest Routing"}
                    </h3>
                </div>
                <MapView start={start} end={end} routes={[route]} />
                <StatsTable results={[route]} />
            </div>
        </div>
    );


}
