import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import { getElement } from "./shared/browser/dom.ts";
import "./style.css";

/*
 * Starts the app: React draws <App /> (the shell and the router,
 * src/app/App.tsx) inside <div id="app"> of index.html.
 */
createRoot(getElement(document, "#app")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
