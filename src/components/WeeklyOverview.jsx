// Seven-day activity visualization built from actual stored records.
// Renders as plain HTML/CSS bars (no charting library) so the dependency
// footprint stays minimal, per the CodeAlpha task constraints.

import { useMemo, useState } from 'react';
import { buildWeeklyBreakdown } from '../utils/fitnessCalculations';
import { getWeekdayLabel, getTodayISO } from '../utils/dateUtils';

const METRICS = [
  { id: 'steps', label: 'Steps' },
  { id: 'calories', label: 'Calories' },
  { id: 'duration', label: 'Minutes' },
];

export default function WeeklyOverview({ records }) {
  const [activeMetric, setActiveMetric] = useState('steps');
  const today = getTodayISO();

  const breakdown = useMemo(
    () => buildWeeklyBreakdown(records, activeMetric),
    [records, activeMetric]
  );

  const highestValue = Math.max(1, ...breakdown.map((day) => day.value));

  return (
    <section className="weekly-overview" aria-label="Weekly activity visualization">
      <div className="weekly-overview__head">
        <h3>This week at a glance</h3>
        <div className="metric-toggle" role="group" aria-label="Choose metric to visualize">
          {METRICS.map((metric) => (
            <button
              key={metric.id}
              type="button"
              className={`metric-toggle__btn${activeMetric === metric.id ? ' is-active' : ''}`}
              onClick={() => setActiveMetric(metric.id)}
              aria-pressed={activeMetric === metric.id}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="weekly-bars">
        {breakdown.map((day, index) => {
          const heightPercent = Math.round((day.value / highestValue) * 100);
          const isToday = day.date === today;
          return (
            <div className="weekly-bars__column" key={day.date}>
              <span className="weekly-bars__value">
                {day.value > 0 ? day.value.toLocaleString() : ''}
              </span>
              <div className="weekly-bars__track">
                <div
                  className={`weekly-bars__fill${isToday ? ' weekly-bars__fill--today' : ''}${
                    day.value === 0 ? ' weekly-bars__fill--empty' : ''
                  }`}
                  style={{ height: `${day.value === 0 ? 2 : Math.max(heightPercent, 4)}%` }}
                  title={`${day.workouts} workout${day.workouts === 1 ? '' : 's'}`}
                />
              </div>
              <span className={`weekly-bars__label${isToday ? ' is-today' : ''}`}>
                {getWeekdayLabel(index)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
