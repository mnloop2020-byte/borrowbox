import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // During `npm run dev`, requests to /api go to the API server
    // (`npm run api`), so the app and the API share one address
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
