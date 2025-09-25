
import "../../styling/WaypointSummary.css";

export default function WaypointSummary({ waypoints, labels, onRemove, onReorder }) {
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("dragIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
        if (dragIndex === dropIndex) return;
        onReorder(dragIndex, dropIndex);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="waypoint-summary-card">
            <h4>Waypoints</h4>
            {waypoints.length === 0 ? (
                <p>No waypoints selected</p>
            ) : (
                <ul className="waypoint-list">
                    {labels.map((label, idx) => (
                        <li
                            key={idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragOver={handleDragOver}
                            className="waypoint-item"
                        >
                            <span className="waypoint-number">{idx + 1}.</span>{" "}
                            {label}
                            <button
                                className="remove-waypoint-btn"
                                onClick={() => onRemove(idx)}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}
