import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  ids: number[];
}

const initialState: FavoritesState = {
  ids: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const foodId = action.payload;
      const existingIndex = state.ids.indexOf(foodId);

      if (existingIndex >= 0) {
        state.ids.splice(existingIndex, 1);
      } else {
        state.ids.push(foodId);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
