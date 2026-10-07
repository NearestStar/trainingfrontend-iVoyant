import { useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import EmptyState from "./components/EmptyState";
import type { Task } from "./types/task";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "all"
  );

  function addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  function toggleTask(id: number) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  const remainingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <div className="container">
        <Header
          taskCount={tasks.length}
          remainingTasks={remainingTasks}
        />

        <main className="main-content">
          <TaskForm onAddTask={addTask} />

          <section className="task-section">
            <div className="task-toolbar">
              <div>
                <h2>Your Tasks</h2>
                <p>Stay focused and get things done.</p>
              </div>

              <div className="filters">
                <button
                  className={filter === "all" ? "filter active" : "filter"}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={
                    filter === "active"
                      ? "filter active"
                      : "filter"
                  }
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>

                <button
                  className={
                    filter === "completed"
                      ? "filter active"
                      : "filter"
                  }
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            {tasks.length > 0 && (
              <div className="progress-card">
                <div className="progress-info">
                  <span>Progress</span>
                  <span>
                    {tasks.length - remainingTasks}/{tasks.length}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        tasks.length === 0
                          ? 0
                          : ((tasks.length - remainingTasks) /
                              tasks.length) *
                            100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {filteredTasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ) : (
              <EmptyState filter={filter} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;