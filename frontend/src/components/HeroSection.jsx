export default function HeroSection({ title, subtitle }) {
    return (
        <div className="hero">
            <p className="hero-subtitle">{subtitle}</p>
            <h1 className="hero-title">{title}</h1>
        </div>
    );
}
