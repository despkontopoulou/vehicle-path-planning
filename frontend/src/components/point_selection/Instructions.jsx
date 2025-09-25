export default function Instructions({ mode }) {
    return (
        <div className="location-summary-card">
            <h3>Instructions</h3>
            <div className="instructions-list">
                <p>
                    <strong>1.</strong> Add a <strong>Start Point</strong>. It appears{" "}
                    <span style={{ color: "orange", fontWeight: "bold" }}>orange</span> until confirmed.
                </p>
                <p>
                    <strong>2.</strong> Confirm the point by clicking{" "}
                    <strong>"Place Point"</strong> in the popup. The marker will turn{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>red</span>.
                </p>
                <p>
                    <strong>3.</strong> Add an <strong>End Point</strong>. It will appear{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>green</span> when confirmed.
                </p>

                {mode === "single" && (
                    <>
                        <p>
                            <strong>4.</strong> Choose <strong>Routing Preference</strong> (Fastest / Shortest).
                        </p>
                        <p>
                            <strong>5.</strong> Choose the <strong>Algorithm</strong> (Dijkstra, A*, Bidirectional).
                        </p>
                        <p>
                            <strong>6.</strong> Click <strong>Find Route</strong>.
                        </p>
                    </>
                )}

                {mode === "compare" && (
                    <p>
                        <strong>4.</strong> Click <strong>Compare Algorithms</strong>.
                        The system will run all algorithms for your chosen vehicle and routing preference.
                    </p>
                )}

                {(mode === "multi" || mode === "multiCompare") && (
                    <>
                        <p>
                            <strong>4.</strong> Add one or more <strong>Waypoints</strong>. They appear{" "}
                            <span style={{ color: "blue", fontWeight: "bold" }}>blue</span> on the map
                            and are numbered in the <strong>Waypoint List</strong>.
                        </p>
                        <p>
                            You can <strong>drag & drop</strong> waypoints in the list to reorder them.
                            The route will follow this order between Start and End.
                        </p>

                        {mode === "multi" && (
                            <>
                                <p>
                                    <strong>5.</strong> Choose <strong>Routing Preference</strong> and{" "}
                                    <strong>Algorithm</strong>.
                                </p>
                                <p>
                                    <strong>6.</strong> Click <strong>Find Multi-Route</strong>.
                                </p>
                            </>
                        )}
                        {mode === "multiCompare" && (
                            <p>
                                <strong>5.</strong> Click <strong>Compare Multi-Algorithms</strong>.
                                The system will evaluate all algorithms with your waypoints.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
