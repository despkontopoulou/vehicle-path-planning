import { useState } from "react";

export default function ProfileSelector({ value, onChange }) {
    const [selected, setSelected] = useState(value || "car_fastest");

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSelected(newValue);
        onChange(newValue); // notify parent
    };

    return (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
            <label style={{ marginRight: 8 }}>Routing profile:</label>
            <select value={selected} onChange={handleChange}>
                <option value="car_fastest">Fastest</option>
                <option value="car_shortest">Shortest</option>
                <option value="car_eco">Eco</option>
            </select>
        </div>
    );
}