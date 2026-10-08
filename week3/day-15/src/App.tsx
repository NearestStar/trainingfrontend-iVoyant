import { useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import EmptyState from "./components/EmptyState";
import "./App.css";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(
    title: string,
    description: string,
    priority: "low" | "medium" | "high"
  ) {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function handleToggleTask(id: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function handleDeleteTask(id: number) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <Header />

      <main className="container">
        {/* Hero */}
        <section className="hero">
          <div>
            <span className="hero-badge">TASK MANAGEMENT</span>

            <h1>
              Organize your work.
              <br />
              <span>Achieve more.</span>
            </h1>

            <p>
              Manage your tasks, stay focused, and keep your
              productivity moving forward.
            </p>
          </div>

          <div className="hero-decoration">
            <div className="decoration-circle circle-one"></div>
            <div className="decoration-circle circle-two"></div>
            <div className="decoration-card">
              <span>✓</span>
              <div>
                <strong>Stay productive</strong>
                <small>One task at a time</small>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="dashboard">
          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">✓</div>
              <div>
                <span>Total Tasks</span>
                <strong>{tasks.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">○</div>
              <div>
                <span>Pending</span>
                <strong>{pendingTasks}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <div>
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="content-grid">
            <TaskForm onAddTask={handleAddTask} />

            <section className="tasks-section">
              <div className="section-header">
                <div>
                  <span className="section-label">YOUR WORK</span>
                  <h2>Tasks</h2>
                </div>

                {tasks.length > 0 && (
                  <span className="task-count">
                    {tasks.length}{" "}
                    {tasks.length === 1 ? "task" : "tasks"}
                  </span>
                )}
              </div>

              {tasks.length === 0 ? (
                <EmptyState />
              ) : (
                <TaskList
                  tasks={tasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              )}
            </section>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Built with React + TypeScript · TaskFlow Pro
        </p>
      </footer>
    </div>
  );
}

export default App;