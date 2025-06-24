import {  useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import Dashboard from "./Pages/Dashboard";
import { MenuIcon } from "@heroicons/react/outline";
import UserManagement from "./Pages/UserManagement";
import HotelManagement from "./Pages/HomeManagement/Hotels/HotelManagement";
import MainCategory from "./Pages/HomeManagement/Categories/MainCategory";
import Bookings from "./Pages/BookingManagement/Bookings";
import ManagePincode from "./Pages/PincodeManagement/ManagePincode";
const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Mobile Menu Icon */}
      <div className="xl:hidden p-4">
        <MenuIcon
          className="h-6 w-6 text-black cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-10 top-0 left-0 h-full bg-gradient-to-br from-teal-700 to-teal-500 text-white transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } xl:relative xl:translate-x-0 xl:w-64`}
      >
        <Sidebar />
      </div>

      {/* Overlay for Mobile View */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto ml-0  p-5">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="HotelManagement" element={<HotelManagement />} />
          <Route path="CategoryManagement" element={<MainCategory />} />
          <Route path="bookingManagement" element={<Bookings />} />
                    <Route path="pincodeManagement" element={<ManagePincode />} />


        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
