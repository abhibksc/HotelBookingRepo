import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DbUrl } from "../../../Constants/URLs";
import { addItem } from "../../../../ReduxStore/Slices/auth";
import { getUserAllBookings } from "../../../../CRUD Operations/Get";

const BookingModal = ({ hotel, onClose }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [address, setAddress] = useState("");
  const user = useSelector((state) => state.auth?.roles?.user);
  const dispatch = useDispatch();

const handleSubmit = async () => {
  if (!checkIn || !checkOut || !address) {
    toast.error("Please fill all the fields.");
    return;
  }

  const bookingData = {
    id: `${hotel.id}-${checkIn}-${checkOut}`, // Unique ID for cart item
    hotelId: hotel.id,
    hotelName: hotel.hotelName,
    pricePerNight: hotel.pricePerNight,
    checkIn,
    checkOut,
    guests,
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
    address,
    status: "pending",
    createdAt: new Date().toISOString(),
    totalPrice: hotel.pricePerNight * (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24), // e.g., nights * price
  };

  try {
    const response = await fetch(`${DbUrl}/bookings.json`, {
      method: "POST",
      body: JSON.stringify(bookingData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Fetch updated bookings from Firebase
      const result = await getUserAllBookings(user?.id);
      if (result.success) {
              // ✅ Add booking to the cart
      dispatch(addItem(bookingData));

      toast.success("Booking submitted. Waiting for admin approval.");
      onClose();
      }

    } else {
      throw new Error("Failed to book");
    }
  } catch (error) {
    toast.error("Something went wrong while booking.");
    console.error(error);
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Book Your Stay</h2>

        <div className="space-y-2">
          <label className="block text-sm">Check-in Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <label className="block text-sm">Check-out Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <label className="block text-sm">Number of Guests</label>
          <input
            type="number"
            min="1"
            className="w-full border p-2 rounded"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />

          <label className="block text-sm">Your Address</label>
          <textarea
            rows="2"
            className="w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-300 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
