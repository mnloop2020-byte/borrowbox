import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import "./style.css";

/*
 * Starts the app: React draws <App /> (the shell and the router,
 * src/app/App.tsx) inside <div id="app"> of index.html.
 */
const root = document.getElementById("app");
if (!root) throw new Error('index.html has no <div id="app">');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
