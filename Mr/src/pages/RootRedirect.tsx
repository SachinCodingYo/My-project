import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { getDecodedToken } from "../utils/token";

const RootRedirect = () => {
  const decoded = getDecodedToken();
  
  // If authenticated, go to dashboard; otherwise go to login
  const redirectPath = decoded ? APP_ROUTES.dashboard : APP_ROUTES.login;
  
  return <Navigate to={redirectPath} replace />;
};

export default RootRedirect;
