export default function StatsTable({ results }) {
    if (!results || results.length === 0) return null;
    const toMs = (nanos) => Math.round(nanos / 1e6);

    return (
        <div style={{ marginTop: 16 }}>
            <h3>Statistics</h3>
            <div>
                {results.map((r, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                        <strong>{r.name}</strong> — cost: {r.totalCost?.toFixed?.(2) ?? r.totalCost}, time: {toMs(r.durationNanos)} ms
                    </div>
                ))}
            </div>
        </div>
    );
}