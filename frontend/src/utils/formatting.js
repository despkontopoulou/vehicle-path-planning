export function formatDuration(seconds) {
    if (!Number.isFinite(seconds)) return "-";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let parts = [];
    if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? "s" : ""}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);
    if (secs > 0 && hrs === 0) parts.push(`${secs} s`);

    return parts.join(" ");
}
