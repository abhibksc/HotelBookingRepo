
import React, { useEffect, useState } from "react";
import LoadingModal from "../../../LoadingModal";
import { Link, useLocation } from "react-router-dom";
import { getUsersHotels } from "../../../../CRUD Operations/Get";
import { FaArrowLeft } from "react-icons/fa";


const HotelListings = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryId = useLocation().state?.categoryId;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getUsersHotels(categoryId);
        if (response.success) {
          setHotels(response.hotels);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hotels", err);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [categoryId]);

  if (loading) return <LoadingModal />;

  return (
   <div
   style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg4.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
  className="pt-24 pb-16 px-4 max-w-screen min-h-screen mx-auto text-white mt-10 rounded-lg shadow-inner"
   
   
  //  className=" bg-cover bg-no-repeat  pt-24 pb-16 px-4 max-w-screen min-h-screen mx-auto text-white mt-10 border "

  
   
   >

      <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-blue-300 mb-6 transition"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          
  <h2 className="text-3xl font-bold text-center mb-10 drop-shadow-lg">
    Hotel Listings
  </h2>



  {hotels.length === 0 ? (
    <div className="flex flex-col items-center justify-center mt-20">
      <img
        src="https://cdn-icons-png.flaticon.com/512/7486/7486791.png"
        alt="No hotels"
        className="w-40 h-40 mb-6 animate-pulse"
      />
      <p className="text-xl font-semibold text-white/80">
        Sorry, no hotels found in this category.
      </p>
      <p className="text-white/60 text-sm">
        Please try another category or check back later!
      </p>
    </div>
  ) : (
    <div className="flex flex-row gap-3">
      {hotels.map((hotel) => (
        <Link
          to={`/mytrip/Category/${categoryId}/hotel/${hotel.id}`}
          key={hotel.id}
          className="hover:no-underline"
        >
          <div className="flex flex-row cursor-pointer    sm:flex-row bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden ">
            <img
              src={hotel.images}
              alt={hotel.hotelName}
              className="w-44 h-44 object-cover rounded-md shadow-md"
            />
            <div className="flex flex-col justify-between p-4 sm:w-2/3">
              <div>
                <h3 className="text-2xl font-semibold text-white drop-shadow mb-2">
                  {hotel.hotelName}
                </h3>
                <p className="text-sm text-white/80 mb-1">
                  <strong>Location:</strong> {hotel.address}
                </p>
                <p className="text-sm text-white/70 italic">
                  {hotel.description || "Nice Hotel"}
                </p>
              </div>
              <div className="mt-4 text-blue-200 font-bold">
                ₹{hotel.pricePerNight} / night
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

  );
};

export default HotelListings;
