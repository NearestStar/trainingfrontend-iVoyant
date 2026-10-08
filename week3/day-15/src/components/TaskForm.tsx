import { useState } from "react";

type TaskFormProps = {
  onAddTask: (
    title: string,
    description: string,
    priority: "low" | "medium" | "high"
  ) => void;
};

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onAddTask(
      title.trim(),
      description.trim(),
      priority
    );

    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <section className="form-card">
      <div className="form-header">
        <div className="form-icon">+</div>

        <div>
          <span className="section-label">CREATE</span>
          <h2>New Task</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="title">
            Task title
          </label>

          <input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            placeholder="Add some details..."
            rows={4}
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as
                  | "low"
                  | "medium"
                  | "high"
              )
            }
          >
            <option value="low">Low priority</option>
            <option value="medium">
              Medium priority
            </option>
            <option value="high">High priority</option>
          </select>
        </div>

        <button
          className="add-task-button"
          type="submit"
          disabled={!title.trim()}
        >
          <span>+</span>
          Add Task
        </button>
      </form>
    </section>
  );
}

export default TaskForm;