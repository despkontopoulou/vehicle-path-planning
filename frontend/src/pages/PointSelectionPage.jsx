// PointSelectionPage.jsx
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import '../styling/PointSelector.css';
import SectionTitle from '../components/point_selection/SectionTitle';
import MapWrapper from '../components/map/MapWrapper';
import SearchBar from "../components/map/SearchBar";
import SelectedLocation from "../components/point_selection/SelectedLocation";
import PointSelectorLayout from "../components/point_selection/PointSelectorLayout";
import LocationSummary from "../components/point_selection/LocationSummary";
import Instructions from "../components/point_selection/Instructions";
import { setupLeafletIcons } from '../utils/leafletSetup';
import InteractiveMap from "../components/map/InteractiveMap";
import { forwardGeocode, reverseGeocode } from "../utils/geocoding";
import ProfileToggle from "../components/point_selection/ProfileToggle";
import AlgorithmToggle from "../components/point_selection/AlgorithmToggle";
import VehicleToggle from "../components/point_selection/VehicleToggle";
import WaypointSummary from "../components/point_selection/WaypointSummary";

export default function PointSelectionPage({ onPointsSelected, mode }) {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [startLabel, setStartLabel] = useState('');
    const [endLabel, setEndLabel] = useState('');
    const [whichToSet, setWhichToSet] = useState('start');
    const [pendingPoint, setPendingPoint] = useState(null);
    const [pendingLabel, setPendingLabel] = useState('');
    const [vehicle, setVehicle] = useState("car");
    const [routingPref, setRoutingPref] = useState("fastest");
    const [algorithm, setAlgorithm] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [waypointLabels, setWaypointLabels] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

    const ALGO_LABELS = {
        astar: "A*",
        astarbi: "A* Bidirectional",
        dijkstra: "Dijkstra",
        dijkstrabi: "Dijkstra Bidirectional"
    };


    const toggleSelection = (item, setFn, current) => {
        if (current.includes(item)) {
            setFn(current.filter(x => x !== item));
        } else {
            setFn([...current, item]);
        }
    };

    const mapRef = useRef(null);

    useEffect(() => {
        setupLeafletIcons();
    }, []);

    const handleMapClick = async (latlng) => {
        if ((mode === "single" || mode === "compare") && !whichToSet) {
            return;
        }

        const label = await reverseGeocode(latlng.lat, latlng.lng);
        setPendingPoint(latlng);
        setPendingLabel(label);
    };

    const handleSearch = async (query) => {
        const result = await forwardGeocode(query);
        if (!result) {
            alert('Location not found.');
            return;
        }
        const latlng = { lat: result.lat, lng: result.lng };
        setPendingPoint(latlng);
        setPendingLabel(result.label);
        mapRef.current?.flyTo(latlng, 17);
    };

    const confirmPoint = () => {
        if (!pendingPoint) return;

        if (whichToSet === "start") {
            setStart(pendingPoint);
            setStartLabel(pendingLabel);
            setWhichToSet("end");
        } else if (whichToSet === "end") {
            setEnd(pendingPoint);
            setEndLabel(pendingLabel);

            if (mode === "multi" || mode === "multiCompare" || mode === "stats") {
                setWhichToSet("waypoint");
            } else {
                setWhichToSet(null);
            }
        } else if (whichToSet === "waypoint") {
            setWaypoints([...waypoints, pendingPoint]);
            setWaypointLabels([...waypointLabels, pendingLabel]);
        }

        setPendingPoint(null);
        setPendingLabel("");
    };

    const handleContinue = () => {
        if (!start || !end) return;

        if (mode === "single") {
            const profile = `${vehicle}_${routingPref}`;
            if (algorithm) onPointsSelected(start, end, profile, algorithm);
        } else if (mode === "compare") {
            const profile = `${vehicle}_${routingPref}`;
            onPointsSelected(start, end, profile);
        } else if (mode === "multi") {
            const profile = `${vehicle}_${routingPref}`;
            if (algorithm) onPointsSelected(start, end, waypoints, profile, algorithm);
        } else if (mode === "multiCompare") {
            const profile = `${vehicle}_${routingPref}`;
            onPointsSelected(start, end, waypoints, profile);
        } else if (mode === "stats") {
            onPointsSelected(
                start,
                end,
                waypoints, // can be empty
                selectedVehicles,
                selectedProfiles,
                selectedAlgorithms
            );
        }
    };

    return (
        <div className="point-selector-container">
            <SectionTitle
                text={
                    mode === 'compare' || mode === 'multiCompare'
                        ? 'Select Points to Compare Algorithms'
                        : mode === 'stats'
                            ? 'Select Points to Show Stats'
                            : 'Select Points to Find Route'
                }
            />

            <PointSelectorLayout
                left={
                    <div className="left-pane-cards">
                        <LocationSummary
                            start={startLabel}
                            end={endLabel}
                            onChange={(which) => {
                                setWhichToSet(which);
                                setPendingPoint(null);
                                setPendingLabel('');
                            }}
                        />

                        {/* Waypoints only in multi modes */}
                        {(mode === "multi" || mode === "multiCompare" || mode === "stats") && (
                            <WaypointSummary
                                waypoints={waypoints}
                                labels={waypointLabels}
                                onRemove={(idx) => {
                                    setWaypoints(waypoints.filter((_, i) => i !== idx));
                                    setWaypointLabels(waypointLabels.filter((_, i) => i !== idx));
                                }}
                                onReorder={(from, to) => {
                                    const reorderedWps = [...waypoints];
                                    const reorderedLabels = [...waypointLabels];
                                    const [movedWp] = reorderedWps.splice(from, 1);
                                    const [movedLabel] = reorderedLabels.splice(from, 1);
                                    reorderedWps.splice(to, 0, movedWp);
                                    reorderedLabels.splice(to, 0, movedLabel);
                                    setWaypoints(reorderedWps);
                                    setWaypointLabels(reorderedLabels);
                                }}
                            />
                        )}

                        {pendingPoint && (
                            <div className="selected-location-container">
                                <SelectedLocation
                                    locationName={pendingLabel}
                                    onConfirm={confirmPoint}
                                    onCancel={() => {
                                        setPendingPoint(null);
                                        setPendingLabel('');
                                    }}
                                />
                            </div>
                        )}
                    </div>
                }
                center={
                    <div className="map-section">
                        <div className="search-bar-container">
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        <div className="map-card">
                            <MapWrapper>
                                <InteractiveMap
                                    ref={mapRef}
                                    start={start}
                                    end={end}
                                    pendingPoint={pendingPoint}
                                    onMapClick={handleMapClick}
                                    waypoints={waypoints}
                                />
                            </MapWrapper>
                        </div>

                        {/* Toggles only for non-stats modes */}
                        {mode !== "stats" && (
                            <div className="toggle-section">
                                <VehicleToggle value={vehicle} onChange={setVehicle} />
                                <ProfileToggle value={routingPref} onChange={setRoutingPref} />

                                {(mode === "single" || mode === "multi") && (
                                    <AlgorithmToggle value={algorithm} onChange={setAlgorithm} />
                                )}
                            </div>
                        )}

                        <div className="point-selector-button-container">
                            <button
                                onClick={handleContinue}
                                disabled={
                                    !start || !end ||
                                    ((mode === "single" || mode === "multi") && !algorithm) ||
                                    ((mode === "multi" || mode === "multiCompare") && waypoints.length === 0) ||
                                    (mode === "stats" && (
                                        selectedVehicles.length === 0 ||
                                        selectedProfiles.length === 0 ||
                                        selectedAlgorithms.length === 0
                                    ))
                                }
                            >
                                {mode === 'compare' ? "Compare Routes" :
                                    mode === 'multi' ? "Find Multi-Route" :
                                        mode === 'multiCompare' ? "Compare Multi-Route" :
                                            mode === 'stats' ? "Show Stats" :
                                                "Find Route"}
                            </button>
                        </div>
                    </div>
                }
                right={
                    <div className="instructions-side">
                        <Instructions mode={mode} />

                        {/* Stats checkboxes */}
                        {mode === "stats" && (
                            <div className="stats-toggles">
                                <h4>Vehicles</h4>
                                {["car", "bike", "foot"].map(v => (
                                    <label key={v}>
                                        <input
                                            type="checkbox"
                                            checked={selectedVehicles.includes(v)}
                                            onChange={() =>
                                                toggleSelection(v, setSelectedVehicles, selectedVehicles)
                                            }
                                        />
                                        {v.charAt(0).toUpperCase() + v.slice(1)}
                                    </label>
                                ))}

                                <h4>Profiles</h4>
                                {["fastest", "shortest"].map(p => (
                                    <label key={p}>
                                        <input
                                            type="checkbox"
                                            checked={selectedProfiles.includes(p)}
                                            onChange={() =>
                                                toggleSelection(p, setSelectedProfiles, selectedProfiles)
                                            }
                                        />
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </label>
                                ))}

                                <h4>Algorithms</h4>
                                {Object.entries(ALGO_LABELS).map(([key, label]) => (
                                    <label key={key}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAlgorithms.includes(key)}
                                            onChange={() =>
                                                toggleSelection(key, setSelectedAlgorithms, selectedAlgorithms)
                                            }
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                }
            />
        </div>
    );
}
