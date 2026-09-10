// A single row in the activity history, with inline (non-alert()) delete
// confirmation so destructive actions always require a deliberate second tap.

import { useState } from 'react';
import { formatDisplayDate } from '../utils/dateUtils';
import { getActivityLabel, activityTracksSteps } from '../utils/activityTypes';

export default function ActivityItem({ record, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const showSteps = activityTracksSteps(record.type) && record.steps > 0;

  return (
    <li className="activity-item">
      <div className="activity-item__main">
        <div className="activity-item__type-icon" aria-hidden="true">
          {getActivityLabel(record.type).charAt(0)}
        </div>
        <div>
          <p className="activity-item__type">{getActivityLabel(record.type)}</p>
          <p className="activity-item__date">{formatDisplayDate(record.date)}</p>
          {record.notes && <p className="activity-item__notes">{record.notes}</p>}
        </div>
      </div>

      <div className="activity-item__stats">
        <span>{record.duration} min</span>
        {showSteps && <span>{record.steps.toLocaleString()} steps</span>}
        <span>{record.calories} kcal</span>
      </div>

      <div className="activity-item__actions">
        {confirmingDelete ? (
          <div className="confirm-delete">
            <span>Delete this activity?</span>
            <button type="button" className="btn btn--small btn--danger" onClick={() => onDelete(record.id)}>
              Yes, delete
            </button>
            <button
              type="button"
              className="btn btn--small btn--ghost"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="btn btn--small btn--ghost" onClick={() => onEdit(record)}>
              Edit
            </button>
            <button
              type="button"
              className="btn btn--small btn--ghost btn--danger-text"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
