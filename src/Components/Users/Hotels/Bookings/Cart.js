import React from "react";
import { useSelector } from "react-redux";
import { CalendarIcon, LocationMarkerIcon, UserIcon } from "@heroicons/react/outline";

const Cart = () => {
  const BookingCart = useSelector((state) => state.auth.UserBookingCart);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Bookings</h2>

      {BookingCart.items.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No bookings yet.</div>
      ) : (
        <div className="grid gap-6">
          {BookingCart.items.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-800">{item.hotelName}</h3>
                <p className="text-sm text-gray-500 mt-1">Booking ID: <span className="text-xs text-gray-600">{item.id}</span></p>
                <div className="mt-2 flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                    <span>{item.checkIn} → {item.checkOut}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-green-500" />
                    <span>Guests: {item.guests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationMarkerIcon className="h-5 w-5 text-red-500" />
                    <span>Address: {item.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:text-right">
                <p className="text-lg font-bold text-green-600">₹ {item.totalPrice}</p>
                <p className="text-sm text-gray-500">₹{item.pricePerNight} / night</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {BookingCart.items.length > 0 && (
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-700">Total Items</h4>
            <span className="text-gray-900 font-medium">{BookingCart.totalItems}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <h4 className="text-lg font-semibold text-gray-700">Total Price</h4>
            <span className="text-green-700 font-bold text-xl">₹ {BookingCart.totalPrice}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
