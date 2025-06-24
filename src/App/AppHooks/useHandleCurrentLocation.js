import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateAreaPin } from "../../ReduxStore/Slices/auth";
import { checkPincodeAvailability } from "../../CRUD Operations/Post";




const useHandleCurrentLocation = ({ triggerVibration }) => {
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [isServiceAble, setIsServiceAble] = useState(false);

  const dispatch = useDispatch();

  // ✅ DEFINE fetchAddressFromCoords BEFORE use
  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.address && data.address.postcode) {
        const pincode = data.address.postcode;
        const pincodeResponse = await checkPincodeAvailability(pincode);

        if (pincodeResponse?.data?.message === "Available") {
          dispatch(updateAreaPin({ pincode }));
          setIsValid(true);
          setPincodeInfo(data.address);
          setIsServiceAble(true);
        } else {
          toast.warn("Service not available in your area");
          setIsValid(false);
          triggerVibration();
        }
      } else {
        toast.warn("Pincode not found or incorrect.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching location data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      setLoading(false);
      return;
    }

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      fetchAddressFromCoords(latitude, longitude); // ✅ Works now
    };

    const onError = (error) => {
      const errorMessages = {
        1: "Permission denied. Please enable location services.",
        2: "Position unavailable.",
        3: "Timeout.",
        default: "Unknown error while fetching location.",
      };
      const message = errorMessages[error.code] || errorMessages.default;
      alert(message);
      setLoading(false);
    };

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  };

  return {
    handleCurrentLocation,
    loading,
    isValid,
    pincodeInfo,
    isServiceAble,
  };
};

export default useHandleCurrentLocation;
