import React, { useEffect, useState } from "react";
import LoadingModal from "../../../LoadingModal";
import { Link, useLocation } from "react-router-dom";
import { getUsersHotels } from "../../../../CRUD Operations/Get";

const HotelListings = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryId = useLocation().state.categoryId;

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
    <div className="pt-24 pb-16 px-4 max-w-screen-xl mx-auto text-white">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {hotels.map((hotel) => (
            <Link
              to={`/mytrip/Category/${categoryId}/hotel/${hotel.id}`}
              key={hotel.id}
            >
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer">
                <img
                  src={hotel.images}
                  alt={hotel.hotelName}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-center text-white drop-shadow">
                    {hotel.hotelName}
                  </h3>
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
