// Centralized Local Storage access for Pulse Log.
// Every read/write to the browser's storage funnels through this module so
// the rest of the app never has to think about parsing, quoting, or errors.

const STORAGE_KEY = 'pulseLogFitnessRecords_v1';

/**
 * Loads the saved activity records from Local Storage.
 * Returns null when there is nothing saved yet, or when the saved
 * data is missing/corrupted, so the caller can decide what to do next.
 */
export function loadRecords() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch (error) {
    // Malformed JSON or a blocked storage API should never crash the app.
    console.warn('Pulse Log: could not read saved activities, starting fresh.', error);
    return null;
  }
}

/**
 * Persists the given array of activity records to Local Storage.
 * Returns true on success and false when saving was not possible
 * (private browsing mode, storage quota exceeded, etc.).
 */
export function saveRecords(records) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.warn('Pulse Log: could not save activities.', error);
    return false;
  }
}

/** Clears all saved activity records. Used only for the reset/demo-data option. */
export function clearRecords() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Pulse Log: could not clear saved activities.', error);
    return false;
  }
}
