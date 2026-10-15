# CampusBite — Redux Toolkit Practice Project

A responsive campus canteen ordering interface built with React, Vite, TypeScript, Redux Toolkit, React-Redux and Lucide icons.

## Features

- Browse a small sample food menu.
- Search by food name, description or category.
- Filter by category, vegetarian meals and favourites.
- Add items to the cart; increase/decrease quantities or remove items.
- Calculate subtotal, service fee and total.
- Place a demo order and view confirmation.
- Responsive layout with a mobile cart drawer.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Redux concepts practised

- `createSlice()` and generated action creators
- reducers and `PayloadAction<T>`
- `configureStore()` with multiple slices
- inferred `RootState` and `AppDispatch`
- typed `useAppSelector()` and `useAppDispatch()` hooks
- shared state versus local component state
- derived totals calculated from store data

## Main folders

```text
src/
├── app/                 # store and typed hooks
├── components/          # header, food card, cart, confirmation
└── features/
    ├── cart/            # cart slice
    ├── favorites/       # favorites slice
    └── menu/             # typed sample menu data
```

## Notes

- Food images use remote Unsplash URLs and require an internet connection to display.
- Checkout is only a front-end demo. No real orders or payments are processed.
- State resets on page reload; persistence and a real API are intentionally outside the Day 19 scope.
- The sample menu and displayed ratings are illustrative demo content.
