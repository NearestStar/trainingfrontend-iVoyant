function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        ✓
      </div>

      <h3>No tasks yet</h3>

      <p>
        Create your first task and start getting things
        done.
      </p>
    </div>
  );
}

export default EmptyState;