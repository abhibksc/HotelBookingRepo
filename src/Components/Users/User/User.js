import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

const User = () => {
    const userToken = useSelector((state) => state.auth.tokens.userToken);

  return (
    <div
      className=" bg-cover "
      style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1687653079484-12a596ddf7a9?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      {/* Add an optional overlay for readability */}
      <div className="bg-black bg-opacity-40 min-h-screen">
        <Routes>
          <Route path={`/profile/${userToken}`} element={<HotelCategory />} />
          {/* <Route path="/Category" element={<HotelCategory />} />
          <Route path="/Category/:id/hotels" element={<HotelListings />} />
          <Route path="/Category/:id/hotel/:id" element={<ParticularHotel />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default User;
