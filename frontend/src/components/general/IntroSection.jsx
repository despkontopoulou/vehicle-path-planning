export default function IntroSection({ image, paragraphs }) {
    return (
        <div className="intro">
            <img src={image} alt="Visual explanation" />
            <div className="intro-text">
                {paragraphs.map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
            </div>
        </div>
    );
}
