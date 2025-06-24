import React, { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useVerifyPincode from "../AppHooks/useVerifyPincode";
import useHandleCurrentLocation from "../AppHooks/useHandleCurrentLocation";
import axios from "axios";

const PincodeModal = () => {
  const User_AreaPin = useSelector((state) => state.auth.roles.user.areaPin);
  const [pincode, setPincode] = useState(User_AreaPin || "");
  const [isVibrating, setIsVibrating] = useState(false);
  const [pincodeList, setPincodeList] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = "https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/pincodes";

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000);
  };

  const {
    verifyPincode,
    loading: loadingManual,
    isValid: isValidManual,
    pincodeInfo: pincodeInfoManual,
    isServiceAble: serviceAbleManual,
  } = useVerifyPincode(triggerVibration);

  const {
    handleCurrentLocation,
    loading: loadingLocation,
    isValid: isValidAuto,
    pincodeInfo: pincodeInfoAuto,
    isServiceAble: serviceAbleAuto,
  } = useHandleCurrentLocation({ triggerVibration });

  const handleChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    if (value.length === 6) {
      verifyPincode(value);
    }
  };

  const loading = loadingManual || loadingLocation;

  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}.json`);
        const data = res.data || {};
        const entries = Object.entries(data)
          .filter(([_, info]) => info.active)
          .map(([pin, info]) => ({
            pincode: pin,
            ...info,
          }));
        setPincodeList(entries);
      } catch (err) {
        setError("Failed to load pincodes.");
        console.error(err);
      }
    };

    fetchPincodes();
  }, []);

  return (
    <div className="relative">
      <div
        className="fixed z-40 inset-0 bg-opacity-40 bg-black flex justify-center items-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/blank-blue-leafy-poster_53876-118169.jpg?semt=ais_hybrid&w=740')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center">
      



      <div className="text-center space-y-4">
  <div className="text-3xl font-extrabold tracking-tight">
    Make{" "}
    <span className="text-red-500 font-[cursive] drop-shadow italic">
      My
    </span>{" "}
    Plane
  </div>

  <span className="font-semibold text-white text-sm block">
    Please enter your pincode to check hotel availability in your area.
  </span>

  {pincodeList.length > 0 && (
    <div className="mt-2 text-left bg-white/80 backdrop-blur-sm rounded-md p-4 shadow">
      <h3 className="font-bold text-black mb-2 text-sm">
        Available Locations:
      </h3>
      <ul className="max-h-40 overflow-y-auto text-xs text-gray-800 list-disc pl-4">
        {pincodeList.map(({ pincode, city, state }) => (
          <li key={pincode}>
            {pincode} - {city}, {state}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


























          <div
            className={`absolute border-b shadow-lg top-14 bg-white flex flex-col rounded-md p-4 w-[350px] ${
              isVibrating ? "vibrate" : ""
            }`}
          >
            <span className="font-semibold text-black">Verify Location</span>
            <p className="text-gray-500 text-sm mb-2">
              Only available in selected cities
            </p>

            <div className="flex items-center mt-2 gap-3">
              <input
                value={pincode}
                onChange={handleChange}
                type="text"
                className="border rounded-md p-2 focus:outline-none flex-1"
                placeholder="Enter pincode"
              />
              <div
                className="text-blue-600 flex gap-2 cursor-pointer"
                onClick={handleCurrentLocation}
              >
                <FaLocationCrosshairs className="mt-1" />
                <span>Current</span>
              </div>
            </div>

            {loading && (
              <div className="flex items-center mt-3 text-sm text-black">
                <div className="animate-spin w-4 h-4 border-2 rounded-full border-blue-400 border-t-transparent mr-2" />
                Detecting location...
              </div>
            )}

            {pincode && !loading && (
              <div className="mt-3 text-sm">
                {serviceAbleManual || serviceAbleAuto ? (
                  <span className="text-green-600 font-semibold">
                    Hotels are available in {pincodeInfoManual?.city || pincodeInfoAuto?.city}
                  </span>
                ) : (
                  <span className="text-red-500">Service not available</span>
                )}
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PincodeModal;
