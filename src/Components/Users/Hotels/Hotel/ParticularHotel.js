import LoadingModal from "../../../LoadingModal";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "./BookingModal"; // import modal
import { useEffect, useState } from "react";
import { IsOpenAuthModal } from "../../../../ReduxStore/Slices/auth";
import { useParams } from "react-router-dom";
import { getUsersParticular_Hotels } from "../../../../CRUD Operations/Get";
import { FaArrowLeft } from "react-icons/fa6";









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
        setHotel({ ...response.hotels, id });
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
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg4.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen pt-24 mb-14 px-4   max-w-screen  mx-auto text-white relative top-[50px]"
    >
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-white hover:text-blue-300 mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <div className="bg-white/20  w-3/6 mx-auto backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/30">
        <img
          src={hotel.images}
          alt={hotel.hotelName}
          className="w-64 md:w-64 h-64 md:h-auto object-cover"
        />
        <div className="p-6 flex flex-col justify-between gap-4 w-full text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2 drop-shadow">{hotel.hotelName}</h2>
            <p className="text-lg mb-2">
              <strong>Price:</strong> ₹{hotel.pricePerNight}
            </p>
            <p className="text-lg mb-2">
              <strong>Availability:</strong> {hotel.Status === 1 ? "YES" : "NO"}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {hotel.address}, {hotel.city}, {hotel.pinCode}
            </p>
            <p className="text-white/80 italic">{hotel.description}</p>
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
