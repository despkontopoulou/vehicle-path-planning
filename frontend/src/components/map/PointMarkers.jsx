import { useMapEvents } from 'react-leaflet';
import { reverseGeocode } from '../../utils/geocoding';

export default function PointMarkers({ setPendingPoint, setPendingLabel }) {
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
