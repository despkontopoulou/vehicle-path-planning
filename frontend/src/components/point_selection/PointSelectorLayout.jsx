export default function PointSelectorLayout({ left, right }) {
    return (
        <div className="point-selector-layout">
            <div className="left-pane">
                {left}
            </div>
            <div className="right-pane">
                {right}
            </div>
        </div>
    );
}