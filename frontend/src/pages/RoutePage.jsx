import RouteForm from '../components/RouteForm';
import MapView from '../components/MapView';

export default function RoutePage() {
    return (
        <div>
            <h2>User Mode: Best Route</h2>
            <RouteForm mode="best" />
            <MapView mode="best" />
        </div>
    );
}