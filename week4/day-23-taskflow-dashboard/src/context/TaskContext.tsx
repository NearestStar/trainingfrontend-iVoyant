
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Task, TaskContextValue } from "../types/task";

const initialTasks: Task[] = [
  { id: 1, title: "Learn Context API", completed: false },
  { id: 2, title: "Understand prop drilling", completed: true },
  { id: 3, title: "Practise Redux Toolkit", completed: false },
];

const TaskContext = createContext<TaskContextValue | undefined>(
  undefined
);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((previous) => [...previous, newTask]);
  }

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}
