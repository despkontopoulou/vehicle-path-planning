export default function LocationSummary({ start, end }) {
    return (
        <div className="location-summary-card">
            <h3>Selected Locations</h3>
            <div>
                <p>
                    <strong>Start:</strong> {start || 'Not selected'}
                </p>
                <p>
                    <strong>End:</strong> {end || 'Not selected'}
                </p>
            </div>
        </div>
    );
}
