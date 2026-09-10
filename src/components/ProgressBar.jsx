// Small, reusable horizontal progress indicator.
// Percentage is clamped for the visual fill so a goal that has been
// exceeded still renders a full (not overflowing) bar, while the raw
// percentage value can still be displayed as text by the caller.

export default function ProgressBar({ percentage, tone = 'steps' }) {
  const safePercentage = Number.isFinite(percentage) ? percentage : 0;
  const visualWidth = Math.min(Math.max(safePercentage, 0), 100);
  const isComplete = safePercentage >= 100;

  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={Math.min(safePercentage, 999)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`progress-fill progress-fill--${tone}${isComplete ? ' progress-fill--complete' : ''}`}
        style={{ width: `${visualWidth}%` }}
      />
    </div>
  );
}
