import PointSelector from "../components/point_selection/PointSelector";
import { useNavigate } from 'react-router-dom';

export default function CompareRoutePage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end) => {
        // You can store points in state management or pass as query params
        navigate('/compare/results', {
            state: {
                start,
                end,
                mode: 'compare'
            }
        });
    };

    return (
        <div>
            <PointSelector onPointsSelected={handlePointsSelected} mode="compare" />
        </div>
    );
}