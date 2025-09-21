export default function ProfileToggle({ value, onChange }) {
    const profiles = [
        { key: "fastest", label: "Fastest" },
        { key: "shortest", label: "Shortest" }
    ];

    return (
        <div className="profile-toggle">
            <label>Routing:</label>
            {profiles.map((p) => (
                <button
                    key={p.key}
                    onClick={() => onChange(p.key)}
                    className={value === p.key ? "active" : ""}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
