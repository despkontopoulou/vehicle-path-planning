import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styling/PointSelector.css';

import PointMarkers from '../components/map/PointMarkers';
import { startIcon, endIcon } from '../components/map/customIcons';
import SectionTitle from '../components/point_selection/SectionTitle';
import MapWrapper from '../components/map/MapWrapper';
import SearchBar from "../components/map/SearchBar";
import SelectedLocation from "../components/point_selection/SelectedLocation";
import PointSelectorLayout from "../components/point_selection/PointSelectorLayout";
import LocationSummary from "../components/point_selection/LocationSummary";
import { setupLeafletIcons } from '../utils/leafletSetup';
import InteractiveMap from "../components/map/InteractiveMap";
import {forwardGeocode, reverseGeocode} from "../utils/geocoding";

export default function PointSelectionPage({ onPointsSelected, mode }) {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [startLabel, setStartLabel] = useState('');
    const [endLabel, setEndLabel] = useState('');
    const [whichToSet, setWhichToSet] = useState('start'); // control which point is being set

    const [pendingPoint, setPendingPoint] = useState(null);
    const [pendingLabel, setPendingLabel] = useState('');

    const mapRef = useRef(null);

    // useEffect(() => {
    //     setTimeout(() => {
    //         mapRef.current?.invalidateSize();
    //     }, 300);
    // }, []);

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
        mapRef.current?.flyTo(latlng, 17); // bigger zoom on search
    };

    const confirmPoint = () => {
        if (!pendingPoint) return;
        if (whichToSet === 'start') {
            setStart(pendingPoint);
            setStartLabel(pendingLabel);
            setWhichToSet('end'); // switch to placing end next
        } else {
            setEnd(pendingPoint);
            setEndLabel(pendingLabel);
        }
        setPendingPoint(null);
        setPendingLabel('');
    };

    const handleContinue = () => {
        if (start && end) onPointsSelected(start, end);
    };

    return (
        <div className="point-selector-container">
            <SectionTitle text={mode === 'compare' ? 'Select Points to Compare Algorithms' : 'Select Points for Optimal Route'} />

            <PointSelectorLayout
                left={
                    <LocationSummary
                        start={startLabel}
                        end={endLabel}
                        onChange={(which) => {
                            setWhichToSet(which);
                            setPendingPoint(null);
                            setPendingLabel('');
                        }}
                    />
                }
                right={
                    <>
                        {/* SearchBar OUTSIDE the map */}
                        <div style={{ margin: '0 20px 10px' }}>
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        <MapWrapper>
                            <InteractiveMap
                                ref={mapRef}
                                start={start}
                                end={end}
                                pendingPoint={pendingPoint}
                                onMapClick={handleMapClick}
                            />
                        </MapWrapper>

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

                        <div className="point-selector-button-container">
                            <button onClick={handleContinue} disabled={!start || !end}>
                                Continue
                            </button>
                        </div>
                    </>
                }
            />
        </div>
    );
}