import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import PointMarkers from "./PointMarkers";
import {endIcon, startIcon} from "./customIcons";

return
<MapContainer
    center={[37.9838, 23.7275]}
    zoom={13}
    className="leaflet-container"
    ref={mapRef}
>
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