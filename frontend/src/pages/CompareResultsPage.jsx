import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { compareRoutes } from '../api/routingApi';
import MapView from '../components/map/MapView';
import ProfileToggle from "../components/point_selection/ProfileToggle";
import StatsTable from "../components/stats/StatsTable";
import '../styling/CompareResults.css'

const ALGO_ORDER = [
    ["astar", "dijkstra"],
    ["astarbi", "dijkstrabi"]
];

const ALGO_LABELS = {
    astar: "A*",
    dijkstra: "Dijkstra",
    astarbi: "A* Bidirectional",
    dijkstrabi: "Dijkstra Bidirectional"
};

function parseLatLng(param) {
    if (!param) return null;
    const [lat, lng] = param.split(',').map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

export default function CompareResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);
    const [profile, setProfile] = useState(sp.get('profile') || "car_fastest");

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
            endLon: end.lng,
            profile
        })
            .then((data) => {
                const entries = Object.entries(data.routes ?? {});
                const mapped = entries.map(([name, r]) => ({
                    name,
                    points: (r.path ?? []).map(p => [p.lat, p.lon]),
                    totalDistanceKm: r.totalDistance,
                    totalTimeSec: r.totalTime,
                    computationTimeMs: (r.computationTimeNs ?? 0) / 1e6,
                    exploredNodes: r.exploredNodes ?? 0,
                    pointsCount: r.pointsCount
                }));
                setRoutes(mapped);
            })
            .catch(e => setErr(e.message || 'Request failed'))
            .finally(() => setLoading(false));
    }, [start, end, profile]);

    if (loading) return <div className="status-message">Loading results…</div>;
    if (err) return <div className="status-message">Error: {err}</div>;
    if (!routes.length) return <div className="status-message">No routes found</div>;

    return (
        <div className="compare-results-page">
            <h2 className="section-title">Compare Results</h2>
            <ProfileToggle value={profile} onChange={setProfile} />

            <div className="results-grid-rows">
                {ALGO_ORDER.map((row, rowIdx) => (
                    <div key={rowIdx} className="results-row">
                        {row.map((algoKey) => {
                            const r = routes.find(rt => rt.name === algoKey);
                            if (!r) return null;
                            return (
                                <div key={r.name} className="result-card">
                                    <h3 className="algo-title">{ALGO_LABELS[r.name] || r.name}</h3>
                                    <MapView start={start} end={end} routes={[r]} index={rowIdx} />
                                    <StatsTable results={[r]} />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
