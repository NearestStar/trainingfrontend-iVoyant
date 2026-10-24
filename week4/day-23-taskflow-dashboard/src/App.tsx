
import { useMemo, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { TaskProvider, useTasks } from "./context/TaskContext";
import {
  store,
  type RootState,
  type AppDispatch,
} from "./redux/store";
import {
  addTask as reduxAddTask,
  toggleTask as reduxToggleTask,
  deleteTask as reduxDeleteTask,
} from "./redux/taskSlice";
import type { Task, TaskActions } from "./types/task";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

type Mode = "props" | "context" | "redux";
type Filter = "all" | "pending" | "completed";

const initialTasks: Task[] = [
  { id: 1, title: "Learn Context API", completed: false },
  { id: 2, title: "Understand prop drilling", completed: true },
  { id: 3, title: "Practise Redux Toolkit", completed: false },
];

function PropDrillingDemo() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const actions: TaskActions = {
    addTask: (title) =>
      setTasks((previous) => [
        ...previous,
        { id: Date.now(), title, completed: false },
      ]),
    toggleTask: (id) =>
      setTasks((previous) =>
        previous.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed }
            : task
        )
      ),
    deleteTask: (id) =>
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      ),
  };

  return <Dashboard tasks={tasks} actions={actions} mode="props" />;
}

function ContextDemo() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <Dashboard
      tasks={tasks}
      actions={{ addTask, toggleTask, deleteTask }}
      mode="context"
    />
  );
}

function ReduxDemo() {
  const tasks = useSelector(
    (state: RootState) => state.tasks.tasks
  );
  const dispatch = useDispatch<AppDispatch>();

  const actions: TaskActions = {
    addTask: (title) => dispatch(reduxAddTask(title)),
    toggleTask: (id) => dispatch(reduxToggleTask(id)),
    deleteTask: (id) => dispatch(reduxDeleteTask(id)),
  };

  return <Dashboard tasks={tasks} actions={actions} mode="redux" />;
}

function Dashboard({
  tasks,
  actions,
  mode,
}: {
  tasks: Task[];
  actions: TaskActions;
  mode: Mode;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        const matchesFilter =
          filter === "all" ||
          (filter === "completed" && task.completed) ||
          (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
      }),
    [tasks, search, filter]
  );

  const modeDetails = {
    props: {
      title: "Prop Drilling",
      description: "Passing data through component layers",
      badge: "PROPS",
      explanation:
        "The parent owns the task state and passes data and callbacks down through components. Intermediate components must forward props they don't use.",
    },
    context: {
      title: "Context API",
      description: "Share state across the component tree",
      badge: "CONTEXT",
      explanation:
        "TaskProvider owns shared state, and consumers can read it using useTasks(). In this demo, the dashboard still passes props to its child components, so this is a partial rather than complete prop-drilling refactor.",
    },
    redux: {
      title: "Redux Toolkit",
      description: "Centralized state and predictable updates",
      badge: "REDUX",
      explanation:
        "The Redux store owns the task state. Components can select data from the store and dispatch actions to update it. This demo uses Redux in the dashboard and forwards props to its children.",
    },
  }[mode];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview">
          <span className="brand-mark">N</span>
          <span>
            <strong>Northstar</strong>
            <small>WORKSPACE</small>
          </span>
        </a>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#overview">
            <span className="nav-icon">◫</span>
            Overview
          </a>
          <a className="nav-link" href="#task-panel">
            <span className="nav-icon">☷</span>
            My tasks
            <span className="nav-count">{pending}</span>
          </a>
          <a className="nav-link" href="#analytics">
            <span className="nav-icon">▥</span>
            Progress
          </a>
        </nav>

        <div className="sidebar-divider" />

        <div className="workspace-label">LEARNING LAB</div>

        <div className="sidebar-note">
          <span className="live-dot" />
          <div>
            <strong>State management</strong>
            <p>Compare three React patterns.</p>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">B</div>
          <div className="profile-copy">
            <strong>My Workspace</strong>
            <small>React Developer</small>
          </div>
          <span className="profile-menu">···</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <span>/</span> Overview
          </div>

          <div className="topbar-right">
            <span className="online-status">
              <span className="live-dot" />
              All changes in session
            </span>
            <div className="avatar top-avatar">B</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row" id="overview">
            <div>
              <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
              <h1>Good work starts here<span>.</span></h1>
              <p className="welcome-subtitle">
                Organize your tasks, track your progress, and keep learning.
              </p>
            </div>

            <div className="date-chip">
              <span>◷</span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </section>

          <section className="hero-card" id="analytics">
            <div className="hero-copy">
              <span className="hero-kicker">YOUR PROGRESS</span>
              <h2>Small steps. Real progress.</h2>
              <p>
                You have completed {completed} of {tasks.length} tasks.
                Keep your momentum going.
              </p>

              <div className="progress-meta">
                <span>Overall completion</span>
                <strong>{progress}%</strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-label="Task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-spark">✦</div>
              <div className="hero-number">{progress}%</div>
              <span className="hero-number-caption">COMPLETED</span>
            </div>
          </section>

          <section className="stats-grid" aria-label="Task statistics">
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon violet">▤</span>
                <span className="stat-label">ALL TASKS</span>
              </div>
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-foot">Tasks in your workspace</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon green">✓</span>
                <span className="stat-label">COMPLETED</span>
              </div>
              <div className="stat-value">{completed}</div>
              <div className="stat-foot">
                {progress}% of all tasks
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon amber">◷</span>
                <span className="stat-label">IN PROGRESS</span>
              </div>
              <div className="stat-value">{pending}</div>
              <div className="stat-foot">Ready for your attention</div>
            </article>
          </section>

          <section className="panel task-panel" id="task-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">STAY ORGANIZED</p>
                <h2>Your tasks</h2>
                <p className="panel-subtitle">
                  Your next accomplishment is one task away.
                </p>
              </div>

              <span className="task-total">
                {visibleTasks.length} shown
              </span>
            </div>

            <div className="task-toolbar">
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search your tasks..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search tasks"
                />
                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </label>

              <div className="filter-tabs" aria-label="Filter tasks">
                {(["all", "pending", "completed"] as Filter[]).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className={filter === item ? "selected" : ""}
                      onClick={() => setFilter(item)}
                    >
                      {item === "all"
                        ? "All tasks"
                        : item === "pending"
                          ? "Pending"
                          : "Completed"}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="task-form-wrap">
              <div className="form-heading">
                <span className="form-plus">+</span>
                <span>Add something to your list</span>
              </div>
              <TaskForm addTask={actions.addTask} />
            </div>

            <div className="list-heading">
              <span>TASK DETAILS</span>
              <span>STATUS & ACTIONS</span>
            </div>

            <TaskList
              tasks={visibleTasks}
              toggleTask={actions.toggleTask}
              deleteTask={actions.deleteTask}
            />
          </section>

          <section className="learning-card">
            <div className="learning-icon">⌘</div>
            <div className="learning-copy">
              <p className="eyebrow">ARCHITECTURE LAB</p>
              <h2>{modeDetails.title}</h2>
              <p>{modeDetails.explanation}</p>
            </div>
            <span className="architecture-badge">{modeDetails.badge}</span>
          </section>

          <footer className="page-footer">
            <span>Northstar Workspace</span>
            <span>Built with React + TypeScript</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const [mode, setMode] = useState<Mode>("props");

  return (
    <>
      <nav className="mode-switcher" aria-label="State management mode">
        <span className="mode-switcher-label">DEMO MODE</span>

        {(["props", "context", "redux"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? "active" : ""}
            onClick={() => setMode(item)}
          >
            {item === "props"
              ? "Prop Drilling"
              : item === "context"
                ? "Context API"
                : "Redux Toolkit"}
          </button>
        ))}
      </nav>

      {mode === "props" && <PropDrillingDemo />}

      {mode === "context" && (
        <TaskProvider>
          <ContextDemo />
        </TaskProvider>
      )}

      {mode === "redux" && <ReduxDemo />}
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
