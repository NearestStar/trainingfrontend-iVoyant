// Vite serves the frontend. API calls are forwarded to the Express server.
const api = { '/api': 'http://localhost:3001' };

export default {
  server: { proxy: api },
  preview: { proxy: api },
};