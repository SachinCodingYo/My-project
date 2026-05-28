import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import { RequireAuth } from "./components/common";
import { APP_ROUTES } from "./constants/routes";
import RootRedirect from "./pages/RootRedirect";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Earnings from "./pages/Earnings";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import MapPage from "./pages/Map";
import History from "./pages/History";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import KYCForm from "./pages/KYCForm";
import KYCStatus from "./pages/KYCStatus";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <RootRedirect />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: APP_ROUTES.login,
            element: <Login />,
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: APP_ROUTES.dashboard, element: <Dashboard /> },
              { path: APP_ROUTES.earnings, element: <Earnings /> },
              { path: APP_ROUTES.orders, element: <Orders /> },
              { path: `${APP_ROUTES.orders}/:id`, element: <OrderDetail /> },
              { path: APP_ROUTES.map, element: <MapPage /> },
              { path: APP_ROUTES.history, element: <History /> },
              { path: APP_ROUTES.profile, element: <Profile /> },
              { path: APP_ROUTES.changePassword, element: <ChangePassword /> },
              { path: APP_ROUTES.notifications, element: <Notifications /> },
            ],
          },
          {
            path: APP_ROUTES.kycForm,
            element: <KYCForm />,
          },
          {
            path: APP_ROUTES.kycStatus,
            element: <KYCStatus />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
