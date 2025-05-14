import RouteForm from '../components/RouteForm';
import MapView from '../components/MapView';
import StatsTable from '../components/StatsTable';

export default function ResearchPage() {
    return (
        <div>
            <h2>Research Mode: Compare Algorithms</h2>
            <RouteForm mode="compare" />
            <MapView mode="compare" />
            <StatsTable />
        </div>
    );
}