import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { Provider } from "./store";
import { ErrorBoundary } from "./components";
import { App } from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Provider>
          <App />
        </Provider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);