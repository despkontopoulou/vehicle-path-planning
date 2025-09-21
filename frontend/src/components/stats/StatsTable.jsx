import '../../styling/Stats.css'
import { formatDuration } from "../../utils/formatting";

export default function StatsTable({ results }) {
    if (!results || results.length === 0) return null;

    return (
        <div className="stats-table">
            <table>
                <thead>
                <tr>
                    <th>Distance</th>
                    <th>Travel Time</th>
                    <th>Computation Time</th>
                    <th>Explored Nodes</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                {results.map((r, idx) => (
                    <tr key={idx}>
                        <td>{r.totalDistanceKm?.toFixed(2)} km</td>
                        <td>{formatDuration(r.totalTimeSec)}</td>
                        <td>{r.computationTimeMs?.toFixed(2)} ms</td>
                        <td>{r.exploredNodes ?? "N/A"}</td>
                        <td>{r.pointsCount ?? "N/A"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
