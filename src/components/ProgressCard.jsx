// A single goal-tracking card: current value vs. goal, a progress bar,
// and the resulting percentage. Used three times on the dashboard for
// steps, calories and workout duration.

import ProgressBar from './ProgressBar';

export default function ProgressCard({ label, unit, current, goal, percentage, tone }) {
  return (
    <div className="progress-card">
      <div className="progress-card__head">
        <span className="progress-card__label">{label}</span>
        <span className="progress-card__percentage">{percentage}%</span>
      </div>
      <ProgressBar percentage={percentage} tone={tone} />
      <p className="progress-card__figures">
        <strong>{current.toLocaleString()}</strong>
        <span className="progress-card__of"> of {goal.toLocaleString()} {unit}</span>
      </p>
    </div>
  );
}
