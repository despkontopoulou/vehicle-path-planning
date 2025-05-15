import Card from './Card';

export default function CardGrid({ cards }) {
    return (
        <div className="card-grid">
            {cards.map((title, idx) => (
                <Card key={idx} title={title} />
            ))}
        </div>
    );
}
