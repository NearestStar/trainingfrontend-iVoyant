
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskState } from "../types/task";

const initialState: TaskState = {
  tasks: [
    { id: 1, title: "Learn Context API", completed: false },
    { id: 2, title: "Understand prop drilling", completed: true },
    { id: 3, title: "Practise Redux Toolkit", completed: false },
  ],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<string>) {
      state.tasks.push({
        id: Date.now(),
        title: action.payload,
        completed: false,
      });
    },

    toggleTask(state, action: PayloadAction<number>) {
      const task = state.tasks.find(
        (item) => item.id === action.payload
      );

      if (task) {
        task.completed = !task.completed;
      }
    },

    deleteTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },
  },
});

export const { addTask, toggleTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;
