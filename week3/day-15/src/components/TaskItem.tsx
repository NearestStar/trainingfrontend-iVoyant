import type { Task } from "../App";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <article
      className={`task-card ${
        task.completed ? "completed" : ""
      }`}
    >
      <button
        className={`checkbox ${
          task.completed ? "checked" : ""
        }`}
        onClick={() => onToggle(task.id)}
        aria-label={
          task.completed
            ? "Mark task as incomplete"
            : "Mark task as complete"
        }
      >
        {task.completed && "✓"}
      </button>

      <div className="task-content">
        <div className="task-top">
          <h3>{task.title}</h3>

          <span
            className={`priority priority-${task.priority}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p>{task.description}</p>
        )}
      </div>

      <button
        className="delete-button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </article>
  );
}

export default TaskItem;