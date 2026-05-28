import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import router from "./constant/router";
import queryClient from "./constant/queryclient";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#020617",
              color: "#fff",
              border: "1px solid #1e293b",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#020617",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#020617",
              },
            },
          }}
        />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);