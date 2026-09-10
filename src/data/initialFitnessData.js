// Starter activity log shown only the very first time Pulse Log opens with
// no saved data. Dates are generated relative to "today" so the sample
// always lands inside the current week, regardless of when this runs.

import { offsetFromToday } from '../utils/dateUtils';

export function buildInitialFitnessData() {
  return [
    {
      id: 'seed-1',
      date: offsetFromToday(0),
      type: 'walking',
      duration: 35,
      steps: 4200,
      calories: 180,
      notes: 'Morning loop around the park before work.',
      createdAt: Date.now() - 6000,
    },
    {
      id: 'seed-2',
      date: offsetFromToday(-1),
      type: 'strength',
      duration: 45,
      steps: 0,
      calories: 260,
      notes: 'Upper body day: push press, rows, planks.',
      createdAt: Date.now() - 5000,
    },
    {
      id: 'seed-3',
      date: offsetFromToday(-1),
      type: 'walking',
      duration: 20,
      steps: 2100,
      calories: 90,
      notes: '',
      createdAt: Date.now() - 4000,
    },
    {
      id: 'seed-4',
      date: offsetFromToday(-2),
      type: 'running',
      duration: 28,
      steps: 4600,
      calories: 310,
      notes: 'Easy pace, felt good in the legs.',
      createdAt: Date.now() - 3000,
    },
    {
      id: 'seed-5',
      date: offsetFromToday(-3),
      type: 'yoga',
      duration: 30,
      steps: 0,
      calories: 95,
      notes: 'Wind-down flow before bed.',
      createdAt: Date.now() - 2000,
    },
    {
      id: 'seed-6',
      date: offsetFromToday(-4),
      type: 'cycling',
      duration: 50,
      steps: 0,
      calories: 420,
      notes: 'Riverside route, one steep climb.',
      createdAt: Date.now() - 1000,
    },
  ];
}
