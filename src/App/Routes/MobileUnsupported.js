import React from "react";
import { Route, Routes } from "react-router-dom";

const MobileUnsupported = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🚫 Mobile Not Supported
              </h1>
              <p className="text-gray-600 text-lg">
                Please open this site on a{" "}
                <span className="font-semibold">desktop or laptop</span> for the
                best experience.
              </p>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default MobileUnsupported;
