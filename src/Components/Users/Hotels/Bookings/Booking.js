import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import LoadingModal from "../../../LoadingModal";
import { useSelector } from "react-redux";
import Cart from "./Cart";

// Lazy load components

const Booking = () => {
  const userToken = useSelector((state) => state.auth.tokens.userToken);

  return (
    <div className="relative  mt-20">
      <div>
        <Routes>
          <Route path={`Cart/${userToken}`} element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
};

export default Booking;
