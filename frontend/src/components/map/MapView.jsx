import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { startIcon, endIcon, waypointIcon } from './customIcons';

const colors = {
    astar: "blue",
    dijkstra: "red",
    astarbi: "green",
    dijkstrabi: "orange"
};

export default function MapView({ start, end, waypoints = [], routes, index = 0 }) {
    const center = start || { lat: 37.9838, lng: 23.7275 };

    return (
        <div className="map-square">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={12}
                className="map-fill"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {routes.map((r) => (
                    <Polyline
                        key={r.name}
                        positions={r.points}
                        color={colors[r.name]}
                        weight={5}
                    />
                ))}

                {start && (
                    <Marker position={[start.lat, start.lng]} icon={startIcon}>
                        <Popup>Start</Popup>
                    </Marker>
                )}

                {waypoints.map((wp, idx) => (
                    <Marker key={idx} position={[wp.lat, wp.lng]} icon={waypointIcon}>
                        <Popup>Waypoint {idx + 1}</Popup>
                    </Marker>
                ))}

                {end && (
                    <Marker position={[end.lat, end.lng]} icon={endIcon}>
                        <Popup>End</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
