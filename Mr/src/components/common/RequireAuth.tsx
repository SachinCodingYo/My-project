import { Navigate, Outlet, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { getDecodedToken } from "../../utils/token";
import { useGetMyKYC } from "../../hooks/useKYC";
import LoadingSkeleton from "./feedback/LoadingSkeleton";

const RequireAuth = () => {
  const location = useLocation();
  const decoded = getDecodedToken();
  const { data: kyc, isLoading, isError } = useGetMyKYC();

  // Check authentication
  if (!decoded || decoded.role !== "MR") {
    return <Navigate to={APP_ROUTES.login} replace state={{ from: location }} />;
  }

  // Show loading while fetching KYC status
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Check if user is trying to access dashboard-related routes
  const isDashboardRoute = [
    APP_ROUTES.dashboard,
    APP_ROUTES.orders,
    APP_ROUTES.map,
    APP_ROUTES.history,
  ].some((route) => location.pathname.startsWith(route));

  if (isDashboardRoute && (isError || !kyc || kyc.status !== "approved")) {
    if (
      kyc?.status === "pending" ||
      kyc?.status === "video_uploaded" ||
      kyc?.videoKycStatus === "pending" ||
      kyc?.videoKycStatus === "failed"
    ) {
      return <Navigate to={APP_ROUTES.kycStatus} replace />;
    }

    return <Navigate to={APP_ROUTES.kycForm} replace />;
  }

  // Allow access to other pages (profile, change password, KYC pages)
  return <Outlet />;
};

export default RequireAuth;
