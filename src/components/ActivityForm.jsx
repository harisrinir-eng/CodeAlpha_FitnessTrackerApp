// Add/Edit activity form. The same component handles both flows: when an
// `editingRecord` is supplied its values pre-fill the fields; otherwise the
// form starts blank, defaulted to today.

import { useEffect, useState } from 'react';
import { ACTIVITY_TYPES, activityTracksSteps } from '../utils/activityTypes';
import { getTodayISO, isValidISODate } from '../utils/dateUtils';

const BLANK_FORM = {
  date: getTodayISO(),
  type: 'walking',
  duration: '',
  steps: '',
  calories: '',
  notes: '',
};

function recordToFormValues(record) {
  return {
    date: record.date,
    type: record.type,
    duration: String(record.duration ?? ''),
    steps: String(record.steps ?? ''),
    calories: String(record.calories ?? ''),
    notes: record.notes ?? '',
  };
}

export default function ActivityForm({ editingRecord, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    editingRecord ? recordToFormValues(editingRecord) : BLANK_FORM
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(editingRecord ? recordToFormValues(editingRecord) : BLANK_FORM);
    setErrors({});
  }, [editingRecord]);

  const stepsRelevant = activityTracksSteps(values.type);

  function handleChange(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!isValidISODate(values.date)) {
      nextErrors.date = 'Enter a valid date.';
    }

    if (!values.type) {
      nextErrors.type = 'Choose an activity type.';
    }

    const duration = Number(values.duration);
    if (values.duration === '' || !Number.isFinite(duration)) {
      nextErrors.duration = 'Enter a duration.';
    } else if (duration < 0) {
      nextErrors.duration = 'Duration cannot be negative.';
    } else if (duration === 0) {
      nextErrors.duration = 'Duration must be greater than zero.';
    } else if (duration > 1440) {
      nextErrors.duration = 'Duration cannot exceed 1440 minutes.';
    }

    const calories = values.calories === '' ? 0 : Number(values.calories);
    if (!Number.isFinite(calories)) {
      nextErrors.calories = 'Enter a valid calorie amount.';
    } else if (calories < 0) {
      nextErrors.calories = 'Calories cannot be negative.';
    }

    if (stepsRelevant && values.steps !== '') {
      const steps = Number(values.steps);
      if (!Number.isFinite(steps)) {
        nextErrors.steps = 'Enter a valid step count.';
      } else if (steps < 0) {
        nextErrors.steps = 'Steps cannot be negative.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      date: values.date,
      type: values.type,
      duration: Number(values.duration),
      steps: stepsRelevant && values.steps !== '' ? Number(values.steps) : 0,
      calories: values.calories === '' ? 0 : Number(values.calories),
      notes: values.notes.trim(),
    });
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingRecord ? 'Edit activity' : 'Log a new activity'}</h2>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="field-date">Date</label>
          <input
            id="field-date"
            type="date"
            value={values.date}
            onChange={(event) => handleChange('date', event.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'error-date' : undefined}
          />
          {errors.date && <p className="form-error" id="error-date" role="alert">{errors.date}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="field-type">Exercise type</label>
          <select
            id="field-type"
            value={values.type}
            onChange={(event) => handleChange('type', event.target.value)}
            aria-invalid={Boolean(errors.type)}
          >
            {ACTIVITY_TYPES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="form-error" role="alert">{errors.type}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="field-duration">Duration (minutes)</label>
          <input
            id="field-duration"
            type="number"
            min="0"
            max="1440"
            value={values.duration}
            onChange={(event) => handleChange('duration', event.target.value)}
            aria-invalid={Boolean(errors.duration)}
            aria-describedby={errors.duration ? 'error-duration' : undefined}
          />
          {errors.duration && (
            <p className="form-error" id="error-duration" role="alert">{errors.duration}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="field-calories">Calories burned</label>
          <input
            id="field-calories"
            type="number"
            min="0"
            value={values.calories}
            onChange={(event) => handleChange('calories', event.target.value)}
            aria-invalid={Boolean(errors.calories)}
            aria-describedby={errors.calories ? 'error-calories' : undefined}
          />
          {errors.calories && (
            <p className="form-error" id="error-calories" role="alert">{errors.calories}</p>
          )}
        </div>
      </div>

      {stepsRelevant && (
        <div className="form-field">
          <label htmlFor="field-steps">Steps</label>
          <input
            id="field-steps"
            type="number"
            min="0"
            value={values.steps}
            onChange={(event) => handleChange('steps', event.target.value)}
            aria-invalid={Boolean(errors.steps)}
            aria-describedby={errors.steps ? 'error-steps' : undefined}
          />
          {errors.steps && <p className="form-error" id="error-steps" role="alert">{errors.steps}</p>}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="field-notes">Notes (optional)</label>
        <textarea
          id="field-notes"
          rows="3"
          value={values.notes}
          onChange={(event) => handleChange('notes', event.target.value)}
          placeholder="How did it feel? Anything worth remembering?"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn">
          {editingRecord ? 'Save changes' : 'Add activity'}
        </button>
      </div>
    </form>
  );
}
