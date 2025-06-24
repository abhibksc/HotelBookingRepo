// hooks/useVerifyPincode.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { checkPincodeAvailability } from "../../CRUD Operations/Post";
import { updateAreaPin } from "../../ReduxStore/Slices/auth";


const useVerifyPincode = (triggerVibration) => {
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [isServiceAble, setIsServiceAble] = useState(false);
  const dispatch = useDispatch();

  const verifyPincode = async (pincode) => {
    setLoading(true);
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (data[0]?.Status === "Success") {
        const pincodeResponse = await checkPincodeAvailability(pincode);

        if (pincodeResponse?.active === true || pincodeResponse?.data?.message === "Available") {
          dispatch(updateAreaPin({ pincode }));
          setIsValid(true);
          setPincodeInfo(data.address);
          setIsServiceAble(true);
        } else {
          toast.warn("Service not available in your area");
          setIsValid(false);
          setIsServiceAble(false);
          triggerVibration?.();
        }
      } else {
        toast.warn("Invalid pincode");
        setIsValid(false);
        setIsServiceAble(false);
        triggerVibration?.();
      }
    } catch (err) {
      toast.error("Error verifying pincode.");
      setIsValid(false);
      setIsServiceAble(false);
    }

    setLoading(false);
  };

  return {
    verifyPincode,
    loading,
    isValid,
    isServiceAble,
    pincodeInfo,
  };
};

export default useVerifyPincode;
