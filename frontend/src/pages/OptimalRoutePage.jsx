import PointSelector from '../components/point_selection/PointSelector';
import { useNavigate } from 'react-router-dom';

export default function OptimalRoutePage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end) => {
        navigate('/optimal/results', {
            state: {
                start,
                end,
                mode: 'optimal'
            }
        });
    };

    return (
        <div>
            <PointSelector onPointsSelected={handlePointsSelected} mode="optimal" />
        </div>
    );
}
