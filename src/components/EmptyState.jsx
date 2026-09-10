// Generic empty-state block, reused wherever a list has nothing to show.

export default function EmptyState({ heading, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark" aria-hidden="true" />
      <h4>{heading}</h4>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn--small" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
