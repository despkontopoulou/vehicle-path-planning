import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { startIcon, endIcon } from './customIcons';

export default function MapView({ start, end, routes }) {
    // Fallback center if no points
    const center = start || { lat: 37.9838, lng: 23.7275 };
    const bounds = (() => {
        const pts = [];
        if (start) pts.push([start.lat, start.lng]);
        if (end) pts.push([end.lat, end.lng]);
        routes.forEach(r => r.points.forEach(p => pts.push(p)));
        return pts.length ? pts : null;
    })();

    return (
        <div style={{ marginTop: 20 }}>
            <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: 500, width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routes.map((r, i) => (
                    <Polyline key={i} positions={r.points} color={i === 0 ? 'blue' : 'purple'} />
                ))}
                {start && <Marker position={[start.lat, start.lng]} icon={startIcon}><Popup>Start</Popup></Marker>}
                {end && <Marker position={[end.lat, end.lng]} icon={endIcon}><Popup>End</Popup></Marker>}
            </MapContainer>
        </div>
    );
}