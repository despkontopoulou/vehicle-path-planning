export default function LocationSummary({ start, end, onChange }) {
    return (
        <div className="location-summary-card">
            <h3>Selected Locations</h3>
            <div>
                <p onClick={() => onChange('start')}>
                    <strong>Start:</strong> {start || 'Not selected'}
                </p>
                <p onClick={() => onChange('end')}>
                    <strong>End:</strong> {end || 'Not selected'}
                </p>
            </div>
        </div>
    );
}
