import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styling/PointSelector.css';

import { startIcon, endIcon } from '../map/customIcons';
import SectionTitle from './SectionTitle';
import MapWrapper from '../map/MapWrapper';
import SearchBar from "../map/SearchBar";
import SelectedLocation from "./SelectedLocation";
import PointSelectorLayout from "./PointSelectorLayout";
import LocationSummary from "./LocationSummary";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Reverse geocoding
async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || 'Unknown location';
}

function PointMarkers({ setPendingPoint, setPendingLabel }) {
    useMapEvents({
        click: async (e) => {
            const { latlng } = e;
            const label = await reverseGeocode(latlng.lat, latlng.lng);
            setPendingPoint(latlng);
            setPendingLabel(label);
        }
    });
    return null;
}

export default function PointSelector({ onPointsSelected, mode }) {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [startLabel, setStartLabel] = useState('');
    const [endLabel, setEndLabel] = useState('');
    const [clickCount, setClickCount] = useState(0);

    const [pendingPoint, setPendingPoint] = useState(null);
    const [pendingLabel, setPendingLabel] = useState('');

    const mapRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            mapRef.current?.invalidateSize();
        }, 300);
    }, []);

    const confirmPoint = () => {
        if (clickCount === 0) {
            setStart(pendingPoint);
            setStartLabel(pendingLabel);
            setClickCount(1);
        } else if (clickCount === 1) {
            setEnd(pendingPoint);
            setEndLabel(pendingLabel);
            setClickCount(2);
        }
        setPendingPoint(null);
    };

    const handleContinue = () => {
        if (start && end) {
            onPointsSelected(start, end);
        }
    };

    return (
        <div className="point-selector-container">
            <SectionTitle
                text={
                    mode === 'compare'
                        ? 'Select Points to Compare Algorithms'
                        : 'Select Points for Optimal Route'
                }
            />

            <PointSelectorLayout
                left={
                    <LocationSummary
                        start={startLabel}
                        end={endLabel}
                        onChange={(which) => {
                            setClickCount(which === 'start' ? 0 : 1);
                            setPendingPoint(null);
                        }}
                    />
                }
                right={
                    <>
                        <MapWrapper>
                            <MapContainer
                                center={[37.9838, 23.7275]}
                                zoom={13}
                                className="leaflet-container"
                                ref={mapRef}
                            >
                                {/* Float the search bar inside the map context */}
                                <div className="top-controls">
                                    <SearchBar />
                                </div>

                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <PointMarkers
                                    setPendingPoint={setPendingPoint}
                                    setPendingLabel={setPendingLabel}
                                />
                                {start && (
                                    <Marker position={start} icon={startIcon}>
                                        <Popup>Start Point</Popup>
                                    </Marker>
                                )}
                                {end && (
                                    <Marker position={end} icon={endIcon}>
                                        <Popup>End Point</Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </MapWrapper>

                        {pendingPoint && (
                            <div className="selected-location-container">
                                <SelectedLocation
                                    locationName={pendingLabel}
                                    onConfirm={confirmPoint}
                                    onCancel={() => setPendingPoint(null)}
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
