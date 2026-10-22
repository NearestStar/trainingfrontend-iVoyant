# QueryLab — Day 20 RTK Query Practice

A standalone React + Vite + TypeScript project demonstrating RTK Query setup, endpoints, query arguments, caching, mutations, and tag-based cache invalidation.

## 1. Install dependencies

```bash
npm install
```

## 2. Run the local mock API

Open a terminal in this project folder and run:

```bash
npm run server
```

Keep this terminal open. The API is served at `http://localhost:3001`.

You can check the seed data at `http://localhost:3001/products`.

## 3. Run the React application

Open a second terminal in the same project folder and run:

```bash
npm run dev
```

Open the Vite URL printed by the terminal.

## Features

- Fetch all products through `getProducts`.
- Search through `searchProducts`, using a string argument and `encodeURIComponent`.
- Fetch an individual item through `getProductById`.
- Add items using `POST`.
- Edit items using `PATCH`.
- Delete items using `DELETE`.
- Cache query results, with a 30-second `keepUnusedDataFor` window after the last subscription disappears.
- Use `tagTypes`, item tags, and the `LIST` tag to invalidate and refresh active queries after mutations.
- Show loading, error, empty, and success states in a responsive interface.

## Learning notes

- `createApi` defines endpoints and generates React hooks.
- `fetchBaseQuery` configures HTTP requests against the local JSON Server.
- The API reducer stores query cache/status in Redux.
- The API middleware coordinates requests, subscriptions, and cache invalidation.
- `providesTags` associates query results with cache tags.
- `invalidatesTags` marks affected cache entries as outdated after mutations.

## Resetting the data

Stop JSON Server and restore `db.json` to its original seed data, or manually remove any extra products/edit your changes. JSON Server writes changes back into `db.json`.

Product images load from Unsplash and therefore require internet access. Product records and CRUD operations are local.
