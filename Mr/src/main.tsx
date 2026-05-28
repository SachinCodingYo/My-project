import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./router";
import queryClient from "./lib/queryClient";
import { store } from "./store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "16px",
              background: "#0f172a",
              color: "#fff",
            },
          }}
        />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
