
import { useState } from "react";

interface TaskFormProps {
  addTask: (title: string) => void;
}

export default function TaskForm({ addTask }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    addTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a task..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="Task title"
        required
      />

      <button type="submit">Add Task</button>
    </form>
  );
}
