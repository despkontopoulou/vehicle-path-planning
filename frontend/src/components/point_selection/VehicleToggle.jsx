export default function VehicleToggle({ value, onChange }) {
    const vehicles = [
        { key: "car", label: "Car" },
        { key: "bike", label: "Bike" },
        { key: "foot", label: "Foot" }
    ];

    return (
        <div className="vehicle-toggle">
            <label>Vehicle:</label>
            {vehicles.map((v) => (
                <button
                    key={v.key}
                    onClick={() => onChange(v.key)}
                    className={value === v.key ? "active" : ""}
                >
                    {v.label}
                </button>
            ))}
        </div>
    );
}
