// hooks/useFetchAddressFromCoords.js
import { useState } from "react";
import { checkPincodeAvailability } from "../CRUD Operations/Post";
import { useDispatch } from "react-redux";
import { updateAreaPin } from "../ReduxStore/Slices/auth";
import { toast } from "react-toastify";

const useFetchAddressFromCoords = ({ triggerVibration }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [isServiceAble, setIsServiceAble] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const fetchAddressFromCoords = async (latitude, longitude) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.address?.postcode) {
        const pincode = data.address.postcode;
        const pincodeRes = await checkPincodeAvailability(pincode);

        if (pincodeRes?.data.message === "Available") {
          dispatch(updateAreaPin({ pincode }));
          setIsValid(true);
          setPincodeInfo(data.address);
          setIsServiceAble(true);
        } else {
          toast.warn("Service not available in your area");
          setIsValid(false);
          triggerVibration?.();
        }
      } else {
        toast.warn("Pincode not found or incorrect.");
      }
    } catch (err) {
      alert("Error fetching location data.");
    }
    setLoading(false);
  };

  return {
    fetchAddressFromCoords,
    loading,
    pincodeInfo,
    isServiceAble,
    isValid,
  };
};

export default useFetchAddressFromCoords;
