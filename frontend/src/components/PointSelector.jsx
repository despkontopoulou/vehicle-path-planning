import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../PointSelector.css';

// Fix Leaflet's default icon issue in many setups
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
        // Ensure map tiles render properly after layout settles
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
        <div className="map-container">
            <h2 style={{ textAlign: 'center', color: '#465149', marginBottom: '20px' }}>
                {mode === 'compare' ? 'Select Points to Compare Algorithms' : 'Select Points for Optimal Route'}
            </h2>

            <MapContainer
                center={[37.9838, 23.7275]}
                zoom={13}
                ref={mapRef}
                className="leaflet-container"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <PointMarkers setStart={setStart} setEnd={setEnd} />
                {start && <Marker position={start} />}
                {end && <Marker position={end} />}
            </MapContainer>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={handleContinue} disabled={!start || !end}>
                    Continue
                </button>
            </div>
        </div>
    );
}
