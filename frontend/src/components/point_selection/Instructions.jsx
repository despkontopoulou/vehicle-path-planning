export default function Instructions({ mode }) {
    return (
        <div className="location-summary-card">
            <h3>Instructions</h3>
            <div className="instructions-list">
                <p>
                    <strong>1.</strong> Add a <strong>Start Point</strong>: It appears{" "}
                    <span style={{ color: "orange", fontWeight: "bold" }}>orange</span> until
                    confirmed.
                </p>
                <p>
                    <strong>2. Confirm Point</strong>: Click the <strong>Place Point</strong>
                    button of the popup to confirm the start location. The marker will turn {" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>red</span>.
                </p>
                <p>
                    <strong>3.</strong> Add an <strong>End Point</strong>: Repeat the above.
                    The confirmed marker will appear{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>green</span>.
                </p>

                {mode === "single" && (
                    <>
                        <p>
                            <strong>4.</strong> Choose <strong>Routing</strong> (Fastest /
                            Shortest).
                        </p>
                        <p>
                            <strong>5.</strong> Choose the <strong>Pathfinding Algorithm</strong> (Dijkstra, A*,
                            Bidirectional).
                        </p>
                        <p>
                            <strong>6.</strong> Click <strong>Find Route</strong>.
                        </p>
                    </>
                )}

                {mode === "compare" && (
                    <p>
                        <strong>4.</strong> Click <strong>Compare Algorithms</strong>.
                    </p>
                )}
            </div>
        </div>
    );
}
