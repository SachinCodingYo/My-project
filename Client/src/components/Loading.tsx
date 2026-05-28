import React from "react";

interface Props {
  h?: string;
}

const Loading: React.FC<Props> = ({ h = "60vh" }) => {

  return (

    <div
      style={{ height: h }}
      className="flex items-center justify-center"
    >

      <div className="flex flex-col items-center gap-3">

        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-600 text-sm">
          Loading...
        </p>

      </div>

    </div>

  );

};

export default Loading;
