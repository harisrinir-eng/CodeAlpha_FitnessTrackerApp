import { useState } from 'react';
import { useFitnessData } from './hooks/useFitnessData';
import { useGoals } from './hooks/useGoals';
import Dashboard from './components/Dashboard';
import ActivityList from './components/ActivityList';
import ActivityForm from './components/ActivityForm';

const VIEWS = {
  DASHBOARD: 'dashboard',
  ACTIVITIES: 'activities',
  FORM: 'form',
};

export default function App() {
  const { records, isReady, lastSaveFailed, addActivity, updateActivity, deleteActivity } =
    useFitnessData();
  const { goals, updateGoals } = useGoals();

  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  function openAddForm() {
    setEditingRecord(null);
    setActiveView(VIEWS.FORM);
  }

  function openEditForm(record) {
    setEditingRecord(record);
    setActiveView(VIEWS.FORM);
  }

  function flashConfirmation(message) {
    setConfirmationMessage(message);
    window.clearTimeout(flashConfirmation._timer);
    flashConfirmation._timer = window.setTimeout(() => setConfirmationMessage(''), 2800);
  }

  function handleFormSubmit(activityData) {
    if (editingRecord) {
      updateActivity(editingRecord.id, activityData);
      flashConfirmation('Activity updated.');
    } else {
      addActivity(activityData);
      flashConfirmation('Activity added.');
    }
    setEditingRecord(null);
    setActiveView(VIEWS.ACTIVITIES);
  }

  function handleDelete(id) {
    deleteActivity(id);
    flashConfirmation('Activity deleted.');
  }

  function handleCancelForm() {
    setEditingRecord(null);
    setActiveView(editingRecord ? VIEWS.ACTIVITIES : VIEWS.DASHBOARD);
  }

  if (!isReady) {
    return (
      <div className="app-loading" role="status">
        Loading your activity log...
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true" />
          <div>
            <h1>Pulse Log</h1>
            <p>Track your movement. Understand your progress.</p>
          </div>
        </div>

        <nav className="app-nav" aria-label="Primary">
          <button
            type="button"
            className={`app-nav__link${activeView === VIEWS.DASHBOARD ? ' is-active' : ''}`}
            onClick={() => setActiveView(VIEWS.DASHBOARD)}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`app-nav__link${activeView === VIEWS.ACTIVITIES ? ' is-active' : ''}`}
            onClick={() => setActiveView(VIEWS.ACTIVITIES)}
          >
            Activities
          </button>
          <button type="button" className="btn btn--nav-cta" onClick={openAddForm}>
            + Log activity
          </button>
        </nav>
      </header>

      {lastSaveFailed && (
        <p className="storage-warning" role="alert">
          Your browser did not allow saving changes. Data will be lost on reload.
        </p>
      )}

      {confirmationMessage && (
        <p className="confirmation-toast" role="status">
          {confirmationMessage}
        </p>
      )}

      <main className="app-main">
        {activeView === VIEWS.DASHBOARD && (
          <Dashboard
            records={records}
            goals={goals}
            onSaveGoals={updateGoals}
            onGoToForm={openAddForm}
          />
        )}

        {activeView === VIEWS.ACTIVITIES && (
          <ActivityList
            records={records}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAddNew={openAddForm}
          />
        )}

        {activeView === VIEWS.FORM && (
          <ActivityForm
            editingRecord={editingRecord}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Pulse Log stores everything locally in this browser. No account, no server.</p>
      </footer>
    </div>
  );
}
