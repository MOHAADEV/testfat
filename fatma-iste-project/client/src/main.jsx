import React from "react";
import ReactDOM from "react-dom/client";
import { DataContexProvider } from "./context/DataContext";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataContexProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </DataContexProvider>
  </React.StrictMode>
);
