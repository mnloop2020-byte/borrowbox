import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Turns JSX into JavaScript and keeps component state on hot reload
  plugins: [react()],
  server: {
    // During `npm run dev`, requests to /api go to the API server
    // (`npm run api`), so the app and the API share one address
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
