export default function WaypointsList({ waypoints, onMoveUp, onMoveDown, onRemove }) {
    if (!waypoints?.length) {
        return (
            <div className="location-summary-card">
                <h3>Waypoints</h3>
                <p>No waypoints added yet.</p>
            </div>
        );
    }

    return (
        <div className="location-summary-card">
            <h3>Waypoints</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {waypoints.map((wp, i) => (
                    <li key={`${wp.lat},${wp.lng},${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: i ? '1px solid #eee' : 'none' }}>
                        <div style={{ maxWidth: '200px' }}>
                            <div><strong>#{i + 1}</strong></div>
                            <div style={{ fontSize: 12, color: '#666' }}>
                                {wp.label || `${wp.lat.toFixed(5)}, ${wp.lng.toFixed(5)}`}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => onMoveUp(i)} disabled={i === 0}>↑</button>
                            <button onClick={() => onMoveDown(i)} disabled={i === waypoints.length - 1}>↓</button>
                            <button onClick={() => onRemove(i)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
