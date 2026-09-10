// Central data hook for Pulse Log.
// Owns the activity records in state, keeps Local Storage in sync, and
// exposes the add/update/delete operations the rest of the app calls into.

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadRecords, saveRecords } from '../utils/storage';
import { buildInitialFitnessData } from '../data/initialFitnessData';

function generateRecordId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Sorts records newest-first by date, falling back to creation order within a day. */
function sortNewestFirst(records) {
  return [...records].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

export function useFitnessData() {
  const [records, setRecords] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [lastSaveFailed, setLastSaveFailed] = useState(false);
  const hasLoadedOnce = useRef(false);

  // Load once on mount: use saved data when present, otherwise seed sample data.
  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;

    const saved = loadRecords();
    if (saved && saved.length > 0) {
      setRecords(sortNewestFirst(saved));
    } else if (saved && saved.length === 0) {
      // User previously deleted everything on purpose - respect the empty state.
      setRecords([]);
    } else {
      const seeded = buildInitialFitnessData();
      setRecords(sortNewestFirst(seeded));
      saveRecords(seeded);
    }
    setIsReady(true);
  }, []);

  // Persist to Local Storage whenever records change, after the initial load.
  useEffect(() => {
    if (!isReady) return;
    const success = saveRecords(records);
    setLastSaveFailed(!success);
  }, [records, isReady]);

  const addActivity = useCallback((activityInput) => {
    const newRecord = {
      id: generateRecordId(),
      createdAt: Date.now(),
      ...activityInput,
    };
    setRecords((previous) => sortNewestFirst([...previous, newRecord]));
    return newRecord;
  }, []);

  const updateActivity = useCallback((id, updates) => {
    setRecords((previous) =>
      sortNewestFirst(
        previous.map((entry) => (entry.id === id ? { ...entry, ...updates, id } : entry))
      )
    );
  }, []);

  const deleteActivity = useCallback((id) => {
    setRecords((previous) => previous.filter((entry) => entry.id !== id));
  }, []);

  return {
    records,
    isReady,
    lastSaveFailed,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}
