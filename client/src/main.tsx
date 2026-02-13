import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { reportWebVitals } from "@lib/web-vitals";

import "@i18n/index";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

reportWebVitals((metric) => {
  if (import.meta.env.DEV) {
    console.debug(`[Web Vitals] ${metric.name}:`, metric.value);
  }
});
