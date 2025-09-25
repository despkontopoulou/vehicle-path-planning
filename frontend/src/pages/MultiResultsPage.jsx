import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getMultiRoute } from '../api/routingApi';
import MapView from '../components/map/MapView';
import StatsTable from "../components/stats/StatsTable";
import '../styling/CompareResults.css'; // reuse same styling for consistency

function parseLatLng(param) {
    if (!param) return null;
    const [lat, lng] = param.split(',').map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

function parseWaypoints(sp) {
    const viaLat = sp.getAll("viaLat").map(Number);
    const viaLon = sp.getAll("viaLon").map(Number);
    const waypoints = [];
    for (let i = 0; i < viaLat.length && i < viaLon.length; i++) {
        if (Number.isFinite(viaLat[i]) && Number.isFinite(viaLon[i])) {
            waypoints.push({ lat: viaLat[i], lng: viaLon[i] });
        }
    }
    return waypoints;
}

export default function MultiResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);
    const waypoints = useMemo(() => parseWaypoints(sp), [sp]);
    const profile = sp.get('profile') || "car_fastest";
    const algorithm = sp.get('algorithm') || "astar";

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
        getMultiRoute({
            startLat: start.lat,
            startLon: start.lng,
            endLat: end.lat,
            endLon: end.lng,
            waypoints: waypoints.map(wp => [wp.lat, wp.lng]),
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
    }, [start, end, waypoints, profile, algorithm]);

    if (loading) return <div className="status-message">Loading results…</div>;
    if (err) return <div className="status-message">Error: {err}</div>;
    if (!route) return <div className="status-message">No route found</div>;

    return (
        <div className="compare-results-page">
            <h2 className="section-title">Multi-Waypoint Route</h2>

            <div className="results-row">
                <div className="result-card">
                    <h3 className="algo-title">
                        {ALGO_LABELS[algorithm] || algorithm} ·{" "}
                        {profile.endsWith("fastest") ? "Fastest Routing" : "Shortest Routing"}
                    </h3>
                    <MapView
                        start={start}
                        end={end}
                        waypoints={waypoints}
                        routes={[route]}
                    />
                    <StatsTable results={[route]} />
                </div>
            </div>
        </div>
    );
}
