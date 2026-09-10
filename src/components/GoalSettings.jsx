// Lets the user adjust their daily step / calorie / duration goals.
// Collapsed by default so it doesn't compete with the main dashboard.

import { useState } from 'react';

export default function GoalSettings({ goals, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(goals);
  const [error, setError] = useState('');

  function handleToggle() {
    setDraft(goals);
    setError('');
    setIsOpen((open) => !open);
  }

  function handleChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const steps = Number(draft.steps);
    const calories = Number(draft.calories);
    const duration = Number(draft.duration);

    if (![steps, calories, duration].every((value) => Number.isFinite(value) && value > 0)) {
      setError('Goals must be positive numbers.');
      return;
    }

    onSave({ steps, calories, duration });
    setError('');
    setIsOpen(false);
  }

  return (
    <div className="goal-settings">
      <button type="button" className="goal-settings__toggle" onClick={handleToggle}>
        {isOpen ? 'Close goal settings' : 'Adjust daily goals'}
      </button>

      {isOpen && (
        <form className="goal-settings__form" onSubmit={handleSubmit}>
          <div className="goal-settings__field">
            <label htmlFor="goal-steps">Step goal</label>
            <input
              id="goal-steps"
              type="number"
              min="1"
              value={draft.steps}
              onChange={(event) => handleChange('steps', event.target.value)}
            />
          </div>
          <div className="goal-settings__field">
            <label htmlFor="goal-calories">Calorie goal</label>
            <input
              id="goal-calories"
              type="number"
              min="1"
              value={draft.calories}
              onChange={(event) => handleChange('calories', event.target.value)}
            />
          </div>
          <div className="goal-settings__field">
            <label htmlFor="goal-duration">Duration goal (min)</label>
            <input
              id="goal-duration"
              type="number"
              min="1"
              value={draft.duration}
              onChange={(event) => handleChange('duration', event.target.value)}
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--small">Save goals</button>
        </form>
      )}
    </div>
  );
}
