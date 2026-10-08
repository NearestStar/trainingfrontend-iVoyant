import { useState } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAddTask(trimmedTitle);
    setTitle("");
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setTitle(event.target.value);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <span className="input-icon">+</span>

        <input
          type="text"
          value={title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          aria-label="Task title"
        />
      </div>

      <button className="add-button" type="submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;