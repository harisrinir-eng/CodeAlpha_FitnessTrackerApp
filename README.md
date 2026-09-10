# Pulse Log — Fitness Tracker

**CodeAlpha App Development Internship — Task 2: Fitness Tracker App**

> Track your movement. Understand your progress.

Pulse Log is a single-page fitness tracking application built with React and Vite. It lets a user log daily workouts, watch a live dashboard of daily and weekly progress, and manage their full activity history — all persisted entirely in the browser with Local Storage. There is no backend, no database, and no account system; everything a user needs lives in this one app.

---

## 1. Project Description

Staying consistent with fitness goals is easier when progress is visible. Pulse Log gives a simple place to record a workout — a walk, a run, a lift, a swim, a yoga session — and immediately see how that entry moves the needle on today's and this week's numbers. The dashboard turns raw log entries into steps, calories, minutes and session counts without the user doing any math themselves.

## 2. Objectives

- Provide a fast, friction-free way to log daily fitness activity.
- Turn stored activity records into meaningful daily and weekly statistics.
- Give the user full control over their data: add, edit, and delete any record.
- Keep the interface clean, responsive, and usable without instructions.
- Persist everything locally so the log survives a page refresh.

## 3. Features

- **Dashboard** with today's and this week's totals, goal progress bars, a seven-day activity visualization, and a breakdown of time spent per activity type.
- **Activity Management** — add, edit, and delete workouts, each with inline (non-blocking) delete confirmation.
- **Activity History** with Today / This week / All filters, sorted newest first.
- **Configurable daily goals** for steps, calories, and workout duration.
- **Local Storage persistence** — refreshing or closing the browser never loses data.
- **Responsive layout** for desktop, tablet, and mobile.
- **Defensive calculations** — the dashboard never shows `NaN`, `Infinity`, or a negative number, no matter what is in storage.

## 4. Dashboard Functionality

The dashboard is built entirely from the stored activity records — nothing is hard-coded:

- **Today's summary**: total steps, calories burned, minutes moved, and workouts logged today.
- **Daily goal progress**: steps, calories, and duration each shown against a configurable goal with a percentage and a progress bar.
- **This week at a glance**: a seven-day bar visualization (Mon–Sun) that can be switched between steps, calories, and minutes.
- **This week's totals**: aggregated weekly steps, calories, duration, and session count.
- **Where this week went**: a breakdown of minutes spent per activity type this week.

## 5. Activity Management

- **Add Activity** — record date, exercise type, duration, calories, optional steps (for step-based activities like walking/running), and optional notes.
- **Edit Activity** — opens the same form pre-filled with the existing record; saving updates the record in place without creating a duplicate.
- **Delete Activity** — requires an inline confirmation step before the record is permanently removed.

## 6. Daily/Weekly Tracking

All totals are calculated live from the underlying records using pure functions in `src/utils/fitnessCalculations.js`, so adding, editing, or deleting an activity instantly updates every dependent number on screen — there are no separately maintained totals that could drift out of sync.

## 7. Local Storage Implementation

Storage access is isolated in `src/utils/storage.js`:

- Records are saved under the key `pulseLogFitnessRecords_v1`.
- Daily goals are saved separately under `pulseLogGoals_v1` (via `src/hooks/useGoals.js`), so adjusting a goal never touches activity history.
- Missing data, blocked storage, and malformed JSON are all handled gracefully — the app falls back to a safe default instead of crashing.
- Sample starter data is generated only the very first time the app runs with no existing saved records.

## 8. Technology Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Framework  | React 18 (functional components + hooks) |
| Build tool | Vite 5                          |
| Language   | JavaScript (JSX)                |
| Styling    | Plain CSS (no UI framework)     |
| Storage    | Browser Local Storage           |

No backend, database, authentication, or external API is used, per the task requirements.

## 9. Project Structure

```
CodeAlpha_FitnessTrackerApp/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ActivityForm.jsx
│   │   ├── ActivityList.jsx
│   │   ├── ActivityItem.jsx
│   │   ├── ProgressCard.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── WeeklyOverview.jsx
│   │   ├── GoalSettings.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── hooks/
│   │   ├── useFitnessData.js
│   │   └── useGoals.js
│   │
│   ├── utils/
│   │   ├── storage.js
│   │   ├── fitnessCalculations.js
│   │   ├── dateUtils.js
│   │   └── activityTypes.js
│   │
│   ├── data/
│   │   └── initialFitnessData.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 10. Installation Requirements

- [Node.js](https://nodejs.org/) version 18 or later
- npm (bundled with Node.js)

## 11. Installation Instructions

1. Extract the project ZIP file.
2. Open a terminal in the `CodeAlpha_FitnessTrackerApp` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

## 12. How to Run Locally

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in a browser.

## 13. Build Instructions

To create an optimized production build:

```bash
npm run build
```

The output is written to the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

## 14. Usage Instructions

1. Open the app — the **Dashboard** loads first, showing today's and this week's stats (pre-populated with a small sample log on first run).
2. Click **+ Log activity** to record a new workout: pick a date, exercise type, duration, calories, and steps (when relevant), then submit.
3. Switch to the **Activities** tab to see the full history, filter by Today / This week / All, and edit or delete any entry.
4. Use **Adjust daily goals** on the dashboard to change your step, calorie, or duration targets.
5. Refresh the browser at any time — your data stays exactly as you left it.

## 15. Testing Checklist

- [x] Application starts with `npm run dev` without console errors.
- [x] `npm run build` completes successfully.
- [x] Dashboard totals match manually summed sample data.
- [x] Weekly visualization reflects actual stored records.
- [x] Adding a valid activity updates the dashboard and activity list immediately.
- [x] Empty, invalid, and negative form inputs are rejected with inline messages.
- [x] Editing an activity pre-fills the form and updates the existing record (no duplicates).
- [x] Deleting an activity requires confirmation and updates all statistics.
- [x] Deleting the last remaining activity does not break the app.
- [x] Refreshing the browser preserves all data.
- [x] Missing and malformed Local Storage data are handled without crashing.
- [x] Layout is usable at desktop, tablet, and mobile widths.


## 16. Author

- **Name:** Hari Srini R
- **Internship:** CodeAlpha App Development Internship
