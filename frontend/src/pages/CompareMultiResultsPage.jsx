import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { compareMultiRoutes } from '../api/routingApi';
import MapView from '../components/map/MapView';
import ProfileToggle from "../components/point_selection/ProfileToggle";
import VehicleToggle from "../components/point_selection/VehicleToggle";
import StatsTable from "../components/stats/StatsTable";
import '../styling/CompareResults.css'; // reuse same styling

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

export default function CompareMultiResultsPage() {
    const [sp] = useSearchParams();
    const start = useMemo(() => parseLatLng(sp.get('start')), [sp]);
    const end = useMemo(() => parseLatLng(sp.get('end')), [sp]);
    const waypoints = useMemo(() => parseWaypoints(sp), [sp]);

    const initialProfile = sp.get('profile') || "car_fastest";
    const [vehicle, setVehicle] = useState(initialProfile.split("_")[0]);
    const [routingPref, setRoutingPref] = useState(initialProfile.split("_")[1]);

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const profile = `${vehicle}_${routingPref}`;

    useEffect(() => {
        if (!start || !end) {
            setErr('Missing start or end coordinates');
            setLoading(false);
            return;
        }

        setLoading(true);
        compareMultiRoutes({
            startLat: start.lat,
            startLon: start.lng,
            endLat: end.lat,
            endLon: end.lng,
            waypoints: waypoints.map(wp => [wp.lat, wp.lng]),
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
    }, [start, end, waypoints, vehicle, routingPref]);

    if (loading) return <div className="status-message">Loading results…</div>;
    if (err) return <div className="status-message">Error: {err}</div>;
    if (!routes.length) return <div className="status-message">No routes found</div>;

    return (
        <div className="compare-results-page">
            <h2 className="section-title">Compare Multi-Waypoint Results</h2>

            <div className="toggle-section">
                <VehicleToggle value={vehicle} onChange={setVehicle} />
                <ProfileToggle value={routingPref} onChange={setRoutingPref} />
            </div>

            <div className="results-grid-rows">
                {ALGO_ORDER.map((row, rowIdx) => (
                    <div key={rowIdx} className="results-row">
                        {row.map((algoKey) => {
                            const r = routes.find(rt => rt.name === algoKey);
                            if (!r) return null;
                            return (
                                <div key={r.name} className="result-card">
                                    <h3 className="algo-title">{ALGO_LABELS[r.name] || r.name}</h3>
                                    <MapView
                                        start={start}
                                        end={end}
                                        waypoints={waypoints}
                                        routes={[r]}
                                        index={rowIdx}
                                    />
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
