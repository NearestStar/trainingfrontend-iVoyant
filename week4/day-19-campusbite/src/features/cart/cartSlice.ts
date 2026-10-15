import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FoodItem } from "../menu/menuData";

export interface CartItem {
  foodId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<FoodItem>) {
      const food = action.payload;
      const existingItem = state.items.find((item) => item.foodId === food.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          foodId: food.id,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: 1,
        });
      }
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((cartItem) => cartItem.foodId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((cartItem) => cartItem.foodId === action.payload);
      if (!item) return;

      if (item.quantity <= 1) {
        state.items = state.items.filter((cartItem) => cartItem.foodId !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.foodId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
