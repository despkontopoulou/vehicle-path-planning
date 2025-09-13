export default function SelectedLocation({ locationName, onConfirm, onCancel }) {
    return (
        <div className="selected-location-popup">
            <p>Place point at:</p>
            <h3>{locationName}</h3>
            <div className="popup-buttons">
                <button onClick={onConfirm}>Place Point</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}
