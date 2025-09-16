import PointSelectionPage from "../pages/PointSelectionPage";
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
            <PointSelectionPage onPointsSelected={handlePointsSelected} mode="optimal" />
        </div>
    );
}
