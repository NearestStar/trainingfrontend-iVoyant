
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskActions {
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export interface TaskState {
  tasks: Task[];
}

export interface TaskContextValue extends TaskActions {
  tasks: Task[];
}
