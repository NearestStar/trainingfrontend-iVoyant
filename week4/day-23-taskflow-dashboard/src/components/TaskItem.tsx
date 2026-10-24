
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
}: TaskItemProps) {
  return (
    <article className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="task-title">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />

        <span>{task.title}</span>
      </label>

      <div className="task-actions">
        <span className="task-status">
          {task.completed ? "Completed" : "Pending"}
        </span>

        <button
          type="button"
          className="delete-button"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
