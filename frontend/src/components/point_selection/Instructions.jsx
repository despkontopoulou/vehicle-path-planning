export default function Instructions({ mode }) {
    return (
        <div className="location-summary-card">
            <h3>Instructions</h3>
            <div className="instructions-list">
                <p><strong>1.</strong> Search or click on the map to place a <strong>Start</strong>point (orange marker).</p>
                <p><strong>2.</strong> Place an <strong>End</strong>point (red marker) the same way.</p>
                <p><strong>3.</strong> Green markers indicate points you’ve confirmed.</p>
                <p><strong>4.</strong> Click <strong>{mode === 'compare' ? "Compare Algorithms" : "Find Optimal Route"}</strong>to proceed.</p>
            </div>
        </div>
    );
}
