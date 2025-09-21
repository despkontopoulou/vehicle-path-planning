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
    const [algorithm, setAlgorithm] = useState(null);;

    const mapRef = useRef(null);

    useEffect(() => {
        setupLeafletIcons();
    }, []);

    const handleMapClick = async (latlng) => {
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
        if (whichToSet === 'start') {
            setStart(pendingPoint);
            setStartLabel(pendingLabel);
            setWhichToSet('end');
        } else {
            setEnd(pendingPoint);
            setEndLabel(pendingLabel);
        }
        setPendingPoint(null);
        setPendingLabel('');
    };

    const handleContinue = () => {
        if (start && end && vehicle && routingPref) {
            const profile = `${vehicle}_${routingPref}`;
            if (mode === "single") {
                if (algorithm) {
                    onPointsSelected(start, end, profile, algorithm);
                }
            } else {
                onPointsSelected(start, end, profile); // ✅ no algorithm needed
            }
        }
    };


    return (
        <div className="point-selector-container">
            <SectionTitle
                text={mode === 'compare'
                    ? 'Select Points to Compare Algorithms'
                    : 'Select Points to Find Route'}
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
                        <Instructions mode={mode} />

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
                right={
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
                                />
                            </MapWrapper>
                        </div>
                        <div className="toggle-section">
                            <VehicleToggle value={vehicle} onChange={setVehicle} />
                            <ProfileToggle value={routingPref} onChange={setRoutingPref} />

                            {mode === "single" && (
                                <AlgorithmToggle value={algorithm} onChange={setAlgorithm} />
                            )}
                        </div>

                        <div className="point-selector-button-container">
                            <button
                                onClick={handleContinue}
                                disabled={
                                    !start ||
                                    !end ||
                                    !vehicle ||
                                    !routingPref ||
                                    (mode === "single" && !algorithm)
                                }
                            >
                                {mode === 'compare' ? "Compare Algorithms" : "Find Route"}
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}