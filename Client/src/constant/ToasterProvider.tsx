import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          padding: "10px 16px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 500,
          background: "rgba(30, 30, 30, 0.85)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease-in-out",
        },
        success: {
          style: {
            background: "rgba(46, 125, 50, 0.9)",
            color: "#e8f5e9",
          },
        },
        error: {
          style: {
            background: "rgba(211, 47, 47, 0.9)",
            color: "#ffebee",
          },
        },
      }}
    />


  );
};

export default ToasterProvider;
