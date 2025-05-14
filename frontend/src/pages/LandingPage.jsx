import { Link } from 'react-router-dom';
export default function LandingPage() {
    return (
        <div className="landing-page">
            <h1>Vehicle Path Planning</h1>
            <p>Research & comparative study of routing algorithms.</p>
            <div className="cards">
                <Link to="/research" className="card">Research Mode </Link>
                <Link to="/route"    className="card">User Mode</Link>
            </div>
        </div>
    );
}