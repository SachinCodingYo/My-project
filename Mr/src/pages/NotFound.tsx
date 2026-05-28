import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
        <SearchX className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The page you are looking for does not exist in the MR panel.
      </p>
      <Link
        to={APP_ROUTES.dashboard}
        className="mt-5 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;
