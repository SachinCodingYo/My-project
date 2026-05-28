import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import RequireAuth from "../components/auth/RequireAuth";
import AdminSignIn from "../components/auth/AdminSignIn";
import Dashboard from "../components/dashboard/Dashboard";
import NotFound from "../components/common/NotFound";
import Operators from "../components/master/operators/Operators";
import VIPCategories from "../components/master/vipCategories/VIPCategories";
import PlanTypes from "../components/master/planTypes/PlanTypes";
import Plans from "../components/master/plans/Plans";
import MRs from "../components/mr/MRs";
import Users from "../components/users/Users";
import Tickets from "../components/support/Tickets";
import MyProfile from "../components/profile/MyProfile";
import PlanTags from "../components/master/planTags/PlanTags";
import Services from "../components/master/services/Services";
import Orders from "../components/orders/Orders";
import Settings from "../components/settings/Settings";
import ChangePassword from "../components/changePassword/ChangePassword";
import FancyNumbers from "../components/master/fancyNumbers/FancyNumbers";
import KYCApprovals from "../components/kyc/KYCApprovals";
import ServicePincodes from "../components/master/servicePincodes/ServicePincodes";
import RedFlags from "../components/redFlags/RedFlags";

const router = createBrowserRouter([
  // Redirect root to signin
  {
    path: "/",
    element: <Navigate to="/signin" replace />,
  },

  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/signin",
        element: <AdminSignIn />,
      },
    ],
  },

  // Protected Routes
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "operators",
            element: <Operators />,
          },
          {
            path: "vip-categories",
            element: <VIPCategories />,
          },
          {
            path: "plan-types",
            element: <PlanTypes />,
          },
          {
            path: "/plan-tags",
            element: <PlanTags />
          },
          {
            path: "plans",
            element: <Plans />,
          },
          {
            path: "fancy-numbers",
            element: <FancyNumbers />,
          },
          {
            path: "/service-pincodes",
            element: <ServicePincodes />,
          },
          {
            path: "mrs",
            element: <MRs />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/red-flags",
            element: <RedFlags />,
          },
          {
            path: "/tickets",
            element: <Tickets />
          },
          {
            path: "/profile",
            element: <MyProfile />,
          },
          {
            path: "/admin-change-password",
            element: <ChangePassword />,
          },
          {
            path: "/services",
            element: <Services />,
          },
          {
            path: "/orders",
            element: <Orders />,
          },
          {
            path: "/kyc-approvals",
            element: <KYCApprovals />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },

  // Fallback Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
