// Shared catalogue of exercise types. Centralizing this keeps the Add/Edit
// form, activity list and dashboard calculations in agreement about which
// fields are meaningful for a given kind of workout.

export const ACTIVITY_TYPES = [
  { id: 'walking', label: 'Walking', tracksSteps: true },
  { id: 'running', label: 'Running', tracksSteps: true },
  { id: 'cycling', label: 'Cycling', tracksSteps: false },
  { id: 'strength', label: 'Strength Training', tracksSteps: false },
  { id: 'swimming', label: 'Swimming', tracksSteps: false },
  { id: 'yoga', label: 'Yoga', tracksSteps: false },
  { id: 'sports', label: 'Sports', tracksSteps: false },
  { id: 'other', label: 'Other', tracksSteps: false },
];

/** Looks up whether a given activity type id typically tracks step count. */
export function activityTracksSteps(typeId) {
  return ACTIVITY_TYPES.some((entry) => entry.id === typeId && entry.tracksSteps);
}

/** Returns the human-readable label for an activity type id. */
export function getActivityLabel(typeId) {
  const found = ACTIVITY_TYPES.find((entry) => entry.id === typeId);
  return found ? found.label : 'Activity';
}
