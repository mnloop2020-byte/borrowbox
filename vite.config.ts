import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Turns JSX into JavaScript and keeps component state on hot reload
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // During `npm run dev`, requests to /api go to the API server
    // (`npm run api`), so the app and the API share one address
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
