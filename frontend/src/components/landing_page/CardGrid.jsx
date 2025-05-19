// components/CardGrid.jsx
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CardGrid({ cards, routes }) {
    const navigate = useNavigate();

    return (
        <div className="card-grid">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="card"
                    onClick={() => navigate(routes[idx])}
                    style={{ cursor: 'pointer' }}
                >
                    <h2 className="card-title">{card}</h2>
                    <ArrowRight className="card-arrow" size={32} />
                </div>
            ))}
        </div>
    );
}
