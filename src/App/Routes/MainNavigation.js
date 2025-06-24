// Components/Users/Hotels/Header/MainNavigation.js
import React, { useState } from "react";
import { FaHotel, FaPlane, FaTrain, FaTaxi } from "react-icons/fa";
import MainNavigationBelow from "./MainNavigationBelow";

const navItems = [
  { name: "Hotels", icon: <FaHotel /> },
  { name: "Flights", icon: <FaPlane /> },
  { name: "Trains", icon: <FaTrain /> },
  { name: "Cabs", icon: <FaTaxi /> },
];

const MainNavigation = () => {
  const [activeTab, setActiveTab] = useState("Hotels");

  return (
    <>
      <div className="container mx-auto w-2/12 rounded-md min-w-20 bg-white shadow-sm border-b sticky top-[300px]  z-40">
        <div className="flex justify-around  gap-8 px-4 py-4 mx-auto">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center cursor-pointer transition hover:text-blue-600 ${
                activeTab === item.name ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pass the selected tab to below */}
      <MainNavigationBelow activeTab={activeTab} />
    </>
  );
};

export default MainNavigation;
