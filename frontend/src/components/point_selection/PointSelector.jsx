import { useEffect, useRef, useState } from 'react';
import {MapContainer, TileLayer, Marker, useMapEvents, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styling/PointSelector.css';
import {startIcon, endIcon} from '../map/customIcons';

import SectionTitle from './SectionTitle';
import MapWrapper from '../map/MapWrapper';
import SearchBar from "../map/SearchBar";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function PointMarkers({ setStart, setEnd }) {
    const [clickCount, setClickCount] = useState(0);

    useMapEvents({
        click(e) {
            const { latlng } = e;
            if (clickCount === 0) {
                setStart(latlng);
                setClickCount(1);
            } else if (clickCount === 1) {
                setEnd(latlng);
                setClickCount(2);
            }
        }
    });

    return null;
}

export default function PointSelector({ onPointsSelected, mode }) {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const mapRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            mapRef.current?.invalidateSize();
        }, 300);
    }, []);

    const handleContinue = () => {
        if (start && end) {
            onPointsSelected(start, end);
        }
    };

    return (
        <div className="point-selector-container">
            <SectionTitle text={
                mode === 'compare'
                    ? 'Select Points to Compare Algorithms'
                    : 'Select Points for Optimal Route'
            }/>

            <MapWrapper>
                <MapContainer
                    center={[37.9838, 23.7275]}
                    zoom={13}
                    className="leaflet-container"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <SearchBar />
                    <PointMarkers setStart={setStart} setEnd={setEnd} />
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

            <div className="point-selector-button-container">
                <button onClick={handleContinue} disabled={!start || !end}>
                    Continue
                </button>
            </div>
        </div>
    );
}
