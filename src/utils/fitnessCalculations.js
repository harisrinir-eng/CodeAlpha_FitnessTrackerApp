// Reusable, UI-free calculation helpers for Pulse Log.
// Dashboard components call these instead of re-deriving totals themselves,
// which keeps the "records -> statistics" flow in one predictable place.

import { getTodayISO, isInCurrentWeek, getCurrentWeekDates } from './dateUtils';

/** Coerces a value to a safe, non-negative finite number (used defensively on every field). */
function toSafeNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

/** Filters the record list down to a single day's entries. */
export function getRecordsForDate(records, isoDate) {
  if (!Array.isArray(records)) return [];
  return records.filter((entry) => entry && entry.date === isoDate);
}

/** Filters the record list down to entries within the current Mon-Sun week. */
export function getRecordsForCurrentWeek(records) {
  if (!Array.isArray(records)) return [];
  return records.filter((entry) => entry && isInCurrentWeek(entry.date));
}

/** Sums a numeric field across a set of records, ignoring invalid/missing values. */
function sumField(records, field) {
  return records.reduce((total, entry) => total + toSafeNumber(entry?.[field]), 0);
}

export function calculateTotalSteps(records) {
  return sumField(records, 'steps');
}

export function calculateTotalCalories(records) {
  return sumField(records, 'calories');
}

export function calculateTotalDuration(records) {
  return sumField(records, 'duration');
}

export function calculateWorkoutCount(records) {
  return Array.isArray(records) ? records.length : 0;
}

/** Builds the today-only summary object used by the dashboard's daily cards. */
export function buildDailySummary(records) {
  const todaysRecords = getRecordsForDate(records, getTodayISO());
  return {
    steps: calculateTotalSteps(todaysRecords),
    calories: calculateTotalCalories(todaysRecords),
    duration: calculateTotalDuration(todaysRecords),
    workouts: calculateWorkoutCount(todaysRecords),
  };
}

/** Builds the current-week summary object used by the dashboard's weekly cards. */
export function buildWeeklySummary(records) {
  const weekRecords = getRecordsForCurrentWeek(records);
  return {
    steps: calculateTotalSteps(weekRecords),
    calories: calculateTotalCalories(weekRecords),
    duration: calculateTotalDuration(weekRecords),
    workouts: calculateWorkoutCount(weekRecords),
  };
}

/**
 * Calculates a progress percentage toward a goal, clamped to a safe
 * 0-100+ integer range so the UI never has to handle NaN or Infinity.
 * Values above 100 are preserved (capped display is a UI concern) but
 * never negative or non-finite.
 */
export function calculateGoalPercentage(current, goal) {
  const safeCurrent = toSafeNumber(current);
  const safeGoal = toSafeNumber(goal);
  if (safeGoal === 0) return 0;
  const percentage = (safeCurrent / safeGoal) * 100;
  if (!Number.isFinite(percentage) || percentage < 0) return 0;
  return Math.round(percentage);
}

/**
 * Builds a 7-entry array (Monday-Sunday) describing per-day totals for the
 * current week, ready for the weekly activity visualization.
 */
export function buildWeeklyBreakdown(records, metric = 'steps') {
  const weekDates = getCurrentWeekDates();
  return weekDates.map((isoDate) => {
    const dayRecords = getRecordsForDate(records, isoDate);
    const value =
      metric === 'calories'
        ? calculateTotalCalories(dayRecords)
        : metric === 'duration'
        ? calculateTotalDuration(dayRecords)
        : calculateTotalSteps(dayRecords);
    return { date: isoDate, value, workouts: dayRecords.length };
  });
}

/** Groups the current week's records by activity type with total minutes, for a distribution view. */
export function buildActivityDistribution(records) {
  const weekRecords = getRecordsForCurrentWeek(records);
  const totals = new Map();

  weekRecords.forEach((entry) => {
    const type = entry?.type || 'other';
    const minutes = toSafeNumber(entry?.duration);
    totals.set(type, (totals.get(type) || 0) + minutes);
  });

  return Array.from(totals.entries())
    .map(([type, minutes]) => ({ type, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}
