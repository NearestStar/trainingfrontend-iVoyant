import type { Task } from "../types/task";

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
      className={
        task.completed
          ? "task-item completed"
          : "task-item"
      }
    >
      <label className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />

        <span className="custom-checkbox">
          {task.completed && "✓"}
        </span>

        <span className="task-title">{task.title}</span>
      </label>

      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        ×
      </button>
    </article>
  );
}

export default TaskItem;