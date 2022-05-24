import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import "./app.scss";
import React from "react";
import { AuthProvider, GlobalStateProvider } from "./context";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

disableReactDevTools();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Router>
    <AuthProvider>
      <GlobalStateProvider>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </GlobalStateProvider>
    </AuthProvider>
  </Router>
  // </React.StrictMode>
);
