export default function PointSelectorLayout({ left, center, right }) {
    return (
        <div className="point-selector-layout">
            <div className="left-pane">
                {left}
            </div>
            <div className="center-pane">
                {center}
            </div>
            <div className="right-pane">
                {right}
            </div>
        </div>
    );
}