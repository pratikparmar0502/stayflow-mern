import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MoodProvider } from "./context/MoodContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MoodProvider>
      <App />
    </MoodProvider>
  </React.StrictMode>
);
