import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">

      <div className="text-center max-w-lg">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600/10 p-6 rounded-full">
            <AlertTriangle size={50} className="text-indigo-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn’t exist or has been moved.
          Please check the URL or navigate back to the dashboard.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-medium"
          >
            <Home size={16} />
            Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
};

export default NotFound;