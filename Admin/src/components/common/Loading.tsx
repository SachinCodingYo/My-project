import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12 text-gray-400">
      <Loader className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
      <span>Loading...</span>
    </div>
  );
};

export default Loading;