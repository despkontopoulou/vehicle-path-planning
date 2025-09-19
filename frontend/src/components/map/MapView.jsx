import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { startIcon, endIcon } from './customIcons';

const colors = ["blue", "red", "green", "orange"];

export default function MapView({ start, end, routes, index = 0 }) {
    const center = start || { lat: 37.9838, lng: 23.7275 };

    return (
        <div style={{ marginTop: 10 }}>
            <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: 300, width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {routes.map((r) => (
                    <Polyline
                        key={r.name}
                        positions={r.points}
                        color={colors[index % colors.length]}
                        weight={5}
                    />
                ))}

                {start && (
                    <Marker position={[start.lat, start.lng]} icon={startIcon}>
                        <Popup>Start</Popup>
                    </Marker>
                )}
                {end && (
                    <Marker position={[end.lat, end.lng]} icon={endIcon}>
                        <Popup>End</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
