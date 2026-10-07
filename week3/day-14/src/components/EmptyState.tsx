type EmptyStateProps = {
  filter: "all" | "active" | "completed";
};

function EmptyState({ filter }: EmptyStateProps) {
  let message = "Your task list is empty.";

  if (filter === "active") {
    message = "You've completed all your tasks.";
  }

  if (filter === "completed") {
    message = "No completed tasks yet.";
  }

  return (
    <div className="empty-state">
      <div className="empty-icon">✓</div>

      <h2>Nothing here</h2>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;