import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStats } from "../api/routingApi";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "../styling/StatsPage.css";

export default function StatsResultsPage() {
    const [sp] = useSearchParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const start = sp.get("start");
        const end = sp.get("end");
        const vehicles = sp.getAll("vehicles");
        const profiles = sp.getAll("profiles");
        const algorithms = sp.getAll("algorithms");

        if (!start || !end) {
            setErr("Missing start or end coordinates!!!");
            setLoading(false);
            return;
        }

        const [startLat, startLon] = start.split(",").map(Number);
        const [endLat, endLon] = end.split(",").map(Number);

        getStats({
            startLat,
            startLon,
            endLat,
            endLon,
            vehicles,
            profiles,
            algorithms,
        })
            .then((res) => {
                setData(res.results || []);
            })
            .catch((e) => setErr(e.message || "Request failed"))
            .finally(() => setLoading(false));
    }, [sp]);

    if (loading) return <div className="status-message">Loading stats…</div>;
    if (err) return <div className="status-message">Error: {err}</div>;
    if (!data.length) return <div className="status-message">No stats found</div>;

    // Format data for charts
    const chartData = data.map((d, idx) => ({
        id: idx,
        vehicle: d.vehicle,
        profile: d.profile,
        algorithm: d.algorithm,
        totalDistanceKm: d.totalDistanceKm,
        totalTimeMin: d.totalTimeSec / 60,
        computationTimeMs: d.computationTimeMs,
        exploredNodes: d.exploredNodes,
        label: `${d.vehicle}-${d.profile}-${d.algorithm}`,
    }));

    return (
        <div className="stats-results-page">
            <h2 className="section-title">Statistics Results</h2>
            <p className="section-description">
                This page provides performance insights into the selected algorithms, vehicles, and routing profiles.
                Hover over the graphs to view detailed values for each configuration.
            </p>

            <div className="chart-grid">
                {/* Computation Time */}
                <div className="chart-card">
                    <h3>Computation Time (ms)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="computationTimeMs" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Total Distance */}
                <div className="chart-card">
                    <h3>Total Distance (km)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalDistanceKm" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Total Time */}
                <div className="chart-card">
                    <h3>Total Time (minutes)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalTimeMin" stroke="#ff7300" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Explored Nodes */}
                <div className="chart-card">
                    <h3>Explored Nodes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="exploredNodes" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Raw Data – spans full grid */}
                <div className="table-card grid-span-2">
                    <h3>Raw Data</h3>
                    <div className="table-scroll">
                        <table>
                            <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Profile</th>
                                <th>Algorithm</th>
                                <th>Distance (km)</th>
                                <th>Time (min)</th>
                                <th>Computation (ms)</th>
                                <th>Explored Nodes</th>
                            </tr>
                            </thead>
                            <tbody>
                            {chartData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.vehicle}</td>
                                    <td>{row.profile}</td>
                                    <td>{row.algorithm}</td>
                                    <td>{row.totalDistanceKm.toFixed(2)}</td>
                                    <td>{row.totalTimeMin.toFixed(1)}</td>
                                    <td>{row.computationTimeMs}</td>
                                    <td>{row.exploredNodes}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
