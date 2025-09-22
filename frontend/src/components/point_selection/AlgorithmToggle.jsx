export default function AlgorithmToggle({ value, onChange }) {
    const algorithms = [
        {key: "astar", label: "A*"},
        {key: "dijkstra",label: "Dijkstra"},
        {key: "astarbi", label: "A* Bidirectional"},
        {key: "dijkstrabi", label: "Dijkstra Bidirectional"}
    ];

    return (
        <div className="profile-toggle">
            <label>Algorithm:</label>
            {algorithms.map((a) => (
                <button
                    key={a.key}
                    onClick={() => onChange(a.key)}
                    className={value === a.key ? "active" : ""}
                >
                    {a.label}
                </button>
            ))}
        </div>
    );
}
