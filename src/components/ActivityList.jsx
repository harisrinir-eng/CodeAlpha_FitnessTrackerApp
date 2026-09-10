// Full activity history with a lightweight Today / This week / All filter.
// Filtering happens entirely against locally stored records - no external
// date service involved.

import { useMemo, useState } from 'react';
import ActivityItem from './ActivityItem';
import EmptyState from './EmptyState';
import { getTodayISO, isInCurrentWeek } from '../utils/dateUtils';

const FILTERS = [
  { id: 'all', label: 'All activities' },
  { id: 'week', label: 'This week' },
  { id: 'today', label: 'Today' },
];

export default function ActivityList({ records, onEdit, onDelete, onAddNew }) {
  const [filter, setFilter] = useState('all');

  const visibleRecords = useMemo(() => {
    if (filter === 'today') {
      const today = getTodayISO();
      return records.filter((entry) => entry.date === today);
    }
    if (filter === 'week') {
      return records.filter((entry) => isInCurrentWeek(entry.date));
    }
    return records;
  }, [records, filter]);

  return (
    <div className="activity-list-section">
      <div className="activity-list-section__head">
        <h2>Activity history</h2>
        <div className="filter-toggle" role="group" aria-label="Filter activities">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`filter-toggle__btn${filter === option.id ? ' is-active' : ''}`}
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState
          heading="No fitness activities recorded yet."
          message="Once you log a workout, it will show up here with its own edit and delete controls."
          actionLabel="Log your first activity"
          onAction={onAddNew}
        />
      ) : visibleRecords.length === 0 ? (
        <EmptyState
          heading="Nothing in this range."
          message="Try a different filter, or log a new activity for this period."
          actionLabel="Log an activity"
          onAction={onAddNew}
        />
      ) : (
        <ul className="activity-list">
          {visibleRecords.map((record) => (
            <ActivityItem key={record.id} record={record} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
