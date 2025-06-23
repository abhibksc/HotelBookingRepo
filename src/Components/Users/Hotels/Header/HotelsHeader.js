import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import Header from "./Header";
import LoadingModal from "../../../LoadingModal";

// Lazy load components

const HotelsHeader = () => {

  return (
    <div className="relative xl:flex h-screen">
      <div>
        <Header />
      </div>
    </div>
  );
};

export default HotelsHeader;
