import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToasterProvider from "./constant/ToasterProvider";
import { router } from "./constant/Router";

const queryClient = new QueryClient();

ReactDOM.createRoot(
document.getElementById("root")!
).render(

<React.StrictMode>


<QueryClientProvider client={queryClient}>

<ToasterProvider  />


<RouterProvider router={router} />

</QueryClientProvider>

</React.StrictMode>

);
