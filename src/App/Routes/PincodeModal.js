import React, { useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useVerifyPincode from "../AppHooks/useVerifyPincode";
import useHandleCurrentLocation from "../AppHooks/useHandleCurrentLocation";

const PincodeModal = () => {
  const User_AreaPin = useSelector((state) => state.auth.roles.user.areaPin);
  const [pincode, setPincode] = useState(User_AreaPin || "");
  const [isVibrating, setIsVibrating] = useState(false);

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
          <div className="text-4xl text-white mb-2">
            <span className="text-red-500 font-bold">My</span> Trip
          </div>
          <span className="font-bold text-white">
            Please enter your pincode to check hotel availability in your area.
          </span>

          <div
            className={`absolute border-b shadow-lg shadow-black top-14 bg-white flex flex-col rounded-md p-4 ${
              isVibrating ? "vibrate" : ""
            }`}
          >
            <span className="font-semibold text-black">Verify Location</span>
            <p className="text-gray-500 text-sm">
              Only available in selected cities
            </p>

            <div className="flex items-center mt-4 gap-5">
              <input
                value={pincode}
                onChange={handleChange}
                type="text"
                className="border rounded-md p-2 focus:outline-none"
                placeholder="Enter pincode"
              />
              <div
                className="text-blue-600 flex gap-2 cursor-pointer"
                onClick={handleCurrentLocation}
              >
                <FaLocationCrosshairs className="mt-1" />
                <span>Current Location</span>
              </div>
            </div>

            {loading && (
              <div className="flex items-center mt-3">
                <div className="spinner-border animate-spin inline-block w-3 h-3 border-4 rounded-full border-blue-300 border-t-transparent"></div>
                <span className="ml-2 text-black">Detecting location...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PincodeModal;
