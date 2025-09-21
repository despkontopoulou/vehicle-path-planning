export default function ProfileToggle({ value, onChange }) {
    const profiles = [
        { key: "car_fastest", label: "Fastest" },
        { key: "car_shortest", label: "Shortest" },
        { key: "car_eco", label: "Eco" }
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
