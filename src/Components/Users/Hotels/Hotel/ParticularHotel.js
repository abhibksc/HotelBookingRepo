import { useDispatch, useSelector } from "react-redux";
import BookingModal from "./BookingModal"; // import modal
import { useEffect, useState } from "react";
import { IsOpenAuthModal } from "../../../../ReduxStore/Slices/auth";
import { useParams } from "react-router-dom";
import { getUsersParticular_Hotels } from "../../../../CRUD Operations/Get";

const ParticularHotel = () => {
  const dispatch = useDispatch();
  const [hotel, setHotel] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const userToken = useSelector((state) => state.auth?.tokens?.userToken);

  useEffect(() => {
    const fetchHotel = async () => {
      const response = await getUsersParticular_Hotels(id);
      if (response.success) {
        setHotel({ ...response.hotels, id }); // include ID for bookings
      } else {
        toast.error("Error fetching hotel details");
      }
    };
    fetchHotel();
  }, [id]);

  const handleBookNow = () => {
    if (!userToken) {
      dispatch(IsOpenAuthModal(true));
    } else {
      setShowModal(true);
    }
  };

  if (!hotel) return <LoadingModal />;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img
          src={hotel.images}
          alt={hotel.hotelName}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />
        <div className="p-6 flex flex-col justify-between gap-4 w-full">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {hotel.hotelName}
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Price:</strong> ₹{hotel.pricePerNight}
            </p>
                     <p className="text-lg text-gray-700 mb-2">
              <strong>Avaiablity:</strong> {hotel.Status == 1 ? "YES" : "NO"}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {hotel.address}, {hotel.city}, {hotel.pinCode}
            </p>
            <p className="text-gray-600">{hotel.description}</p>
          </div>
          <button
            className="mt-4 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg hover:scale-105 transition"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </div>

      {showModal && (
        <BookingModal hotel={hotel} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ParticularHotel;
