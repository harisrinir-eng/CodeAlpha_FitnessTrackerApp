// Persists the user's daily goal targets separately from activity records,
// so adjusting a goal never touches the activity history.

import { useEffect, useState } from 'react';

const GOALS_KEY = 'pulseLogGoals_v1';

const DEFAULT_GOALS = {
  steps: 10000,
  calories: 500,
  duration: 60,
};

function loadGoals() {
  try {
    const raw = window.localStorage.getItem(GOALS_KEY);
    if (!raw) return DEFAULT_GOALS;
    const parsed = JSON.parse(raw);
    return {
      steps: Number(parsed.steps) > 0 ? Number(parsed.steps) : DEFAULT_GOALS.steps,
      calories: Number(parsed.calories) > 0 ? Number(parsed.calories) : DEFAULT_GOALS.calories,
      duration: Number(parsed.duration) > 0 ? Number(parsed.duration) : DEFAULT_GOALS.duration,
    };
  } catch (error) {
    console.warn('Pulse Log: could not read saved goals, using defaults.', error);
    return DEFAULT_GOALS;
  }
}

export function useGoals() {
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const updateGoals = (nextGoals) => {
    setGoals(nextGoals);
    try {
      window.localStorage.setItem(GOALS_KEY, JSON.stringify(nextGoals));
    } catch (error) {
      console.warn('Pulse Log: could not save goals.', error);
    }
  };

  return { goals, updateGoals };
}
