import { forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { startIcon, endIcon, pendingIcon } from './customIcons';

function MapClickHandler({ onClick }) {
    useMapEvents({
        click: (e) => onClick(e.latlng)
    });
    return null;
}

function FlyController(_props, ref) {
    const map = useMap();
    useImperativeHandle(ref, () => ({
        flyTo: (latlng, zoom = 17) => map.flyTo([latlng.lat, latlng.lng], zoom),
    }), [map]);
    return null;
}
const FlyControllerWithRef = forwardRef(FlyController);

const InteractiveMap = forwardRef(function InteractiveMap(
    { start, end, pendingPoint, onMapClick, initialCenter = { lat: 37.9838, lng: 23.7275 }, initialZoom = 13 },
    ref
) {
    return (
        <MapContainer center={[initialCenter.lat, initialCenter.lng]} zoom={initialZoom} className="leaflet-container">
            <FlyControllerWithRef ref={ref} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onClick={onMapClick} />

            {pendingPoint && (
                <Marker position={pendingPoint} icon={pendingIcon}>
                    <Popup>Click "Place Point" to confirm</Popup>
                </Marker>
            )}
            {start && <Marker position={start} icon={startIcon}><Popup>Start Point</Popup></Marker>}
            {end && <Marker position={end} icon={endIcon}><Popup>End Point</Popup></Marker>}
        </MapContainer>
    );
});

export default InteractiveMap;