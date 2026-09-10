// Date helpers for Pulse Log.
// All dates are handled as local-time "YYYY-MM-DD" strings so that
// storage, filtering and display never drift because of timezone offsets.

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Converts a Date object into a local "YYYY-MM-DD" string (no UTC shift). */
export function toISODate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns today's date as a local "YYYY-MM-DD" string. */
export function getTodayISO() {
  return toISODate(new Date());
}

/** Parses a "YYYY-MM-DD" string into a local Date at midnight. */
export function parseISODate(isoString) {
  if (!isoString || typeof isoString !== 'string') return null;
  const parts = isoString.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Validates that a string is a real calendar date in YYYY-MM-DD form. */
export function isValidISODate(isoString) {
  const parsed = parseISODate(isoString);
  if (!parsed) return false;
  return toISODate(parsed) === isoString;
}

/** Returns the Monday of the week containing the given date (local time). */
export function getStartOfWeek(dateObj) {
  const clone = new Date(dateObj);
  const currentDay = clone.getDay(); // 0 = Sunday ... 6 = Saturday
  const distanceFromMonday = (currentDay + 6) % 7; // Monday-based offset
  clone.setDate(clone.getDate() - distanceFromMonday);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

/** Returns true when the given ISO date string falls in the current week (Mon-Sun). */
export function isInCurrentWeek(isoString) {
  const target = parseISODate(isoString);
  if (!target) return false;
  const weekStart = getStartOfWeek(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return target >= weekStart && target <= weekEnd;
}

/** Returns an array of the 7 ISO date strings for the current Mon-Sun week, in order. */
export function getCurrentWeekDates() {
  const weekStart = getStartOfWeek(new Date());
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(toISODate(day));
  }
  return days;
}

/** Short weekday label ("Mon", "Tue", ...) for a given index (0 = Monday). */
export function getWeekdayLabel(index) {
  return WEEKDAY_LABELS[index] ?? '';
}

/** Formats an ISO date string for human-friendly display, e.g. "Wed, 3 Sep". */
export function formatDisplayDate(isoString) {
  const parsed = parseISODate(isoString);
  if (!parsed) return 'Unknown date';
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/** Returns an ISO date string offset by a number of days from today (can be negative). */
export function offsetFromToday(dayOffset) {
  const target = new Date();
  target.setDate(target.getDate() + dayOffset);
  return toISODate(target);
}
