import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const RequireAuth = () => {
  const token = Cookies.get("accessToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;