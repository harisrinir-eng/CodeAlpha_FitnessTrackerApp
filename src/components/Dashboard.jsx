// Dashboard: the at-a-glance view of today's and this week's fitness data.
// Every number here is derived live from the stored activity records -
// nothing on this screen is hard-coded.

import { useMemo } from 'react';
import {
  buildDailySummary,
  buildWeeklySummary,
  calculateGoalPercentage,
  buildActivityDistribution,
} from '../utils/fitnessCalculations';
import { getActivityLabel } from '../utils/activityTypes';
import ProgressCard from './ProgressCard';
import WeeklyOverview from './WeeklyOverview';
import GoalSettings from './GoalSettings';

export default function Dashboard({ records, goals, onSaveGoals, onGoToForm }) {
  const daily = useMemo(() => buildDailySummary(records), [records]);
  const weekly = useMemo(() => buildWeeklySummary(records), [records]);
  const distribution = useMemo(() => buildActivityDistribution(records), [records]);

  const stepPercent = calculateGoalPercentage(daily.steps, goals.steps);
  const caloriePercent = calculateGoalPercentage(daily.calories, goals.calories);
  const durationPercent = calculateGoalPercentage(daily.duration, goals.duration);

  const hasAnyRecords = records.length > 0;
  const totalDistributionMinutes = distribution.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="dashboard">
      <div className="dashboard__intro">
        <div>
          <h2>Today's summary</h2>
          <p className="dashboard__subtext">A quick read on how today is shaping up.</p>
        </div>
        <button type="button" className="btn" onClick={onGoToForm}>
          + Log activity
        </button>
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <span className="stat-tile__value">{daily.steps.toLocaleString()}</span>
          <span className="stat-tile__label">Steps today</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{daily.calories.toLocaleString()}</span>
          <span className="stat-tile__label">Calories burned</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{daily.duration.toLocaleString()}</span>
          <span className="stat-tile__label">Minutes moved</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{daily.workouts.toLocaleString()}</span>
          <span className="stat-tile__label">Workouts logged</span>
        </div>
      </div>

      <section className="goal-section">
        <div className="goal-section__head">
          <h3>Daily goal progress</h3>
          <GoalSettings goals={goals} onSave={onSaveGoals} />
        </div>
        <div className="progress-grid">
          <ProgressCard
            label="Steps"
            unit="steps"
            current={daily.steps}
            goal={goals.steps}
            percentage={stepPercent}
            tone="steps"
          />
          <ProgressCard
            label="Calories"
            unit="kcal"
            current={daily.calories}
            goal={goals.calories}
            percentage={caloriePercent}
            tone="calories"
          />
          <ProgressCard
            label="Duration"
            unit="min"
            current={daily.duration}
            goal={goals.duration}
            percentage={durationPercent}
            tone="duration"
          />
        </div>
      </section>

      <WeeklyOverview records={records} />

      <section className="dashboard-grid">
        <div className="week-summary-card">
          <h3>This week's totals</h3>
          <ul className="week-summary-list">
            <li>
              <span>Steps</span>
              <strong>{weekly.steps.toLocaleString()}</strong>
            </li>
            <li>
              <span>Calories</span>
              <strong>{weekly.calories.toLocaleString()}</strong>
            </li>
            <li>
              <span>Duration</span>
              <strong>{weekly.duration.toLocaleString()} min</strong>
            </li>
            <li>
              <span>Sessions</span>
              <strong>{weekly.workouts.toLocaleString()}</strong>
            </li>
          </ul>
        </div>

        <div className="distribution-card">
          <h3>Where this week went</h3>
          {distribution.length === 0 ? (
            <p className="dashboard__subtext">Log a workout to see how your time breaks down.</p>
          ) : (
            <ul className="distribution-list">
              {distribution.map((item) => {
                const share = totalDistributionMinutes
                  ? Math.round((item.minutes / totalDistributionMinutes) * 100)
                  : 0;
                return (
                  <li key={item.type} className="distribution-list__row">
                    <span className="distribution-list__type">{getActivityLabel(item.type)}</span>
                    <div className="distribution-list__bar-track">
                      <div className="distribution-list__bar-fill" style={{ width: `${share}%` }} />
                    </div>
                    <span className="distribution-list__minutes">{item.minutes} min</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {!hasAnyRecords && (
        <p className="dashboard__empty-hint">
          Your log is empty right now - add your first activity to see these numbers move.
        </p>
      )}
    </div>
  );
}
