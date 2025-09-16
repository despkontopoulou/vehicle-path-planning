import PointSelectionPage from "../pages/PointSelectionPage";
import { useNavigate } from 'react-router-dom';

export default function CompareRoutePage() {
    const navigate = useNavigate();

    const handlePointsSelected = (start, end) => {
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
            <PointSelectionPage onPointsSelected={handlePointsSelected} mode="compare" />
        </div>
    );
}