import { ArrowRight } from 'lucide-react';

export default function Card({ title }) {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <ArrowRight className="card-arrow" />
        </div>
    );
}
