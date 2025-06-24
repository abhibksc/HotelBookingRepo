import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserTypeHandler from "./UserTypeHandler";
import PincodeModal from "./PincodeModal";
import DesktopRoutes from "./DesktopRoutes";
import { getUserAllBookings } from "../../CRUD Operations/Get";
import { setCart, updateAreaPin } from "../../ReduxStore/Slices/auth";
import UserLoginSingupModal from "../../Components/Users/Hotels/Hotel/UserLoginSingupModal";
import { checkPincodeAvailability } from "../../CRUD Operations/Post";
import AdminSuperAdminAuth from "../../Components/AdminPanel/AdminSuperAdminAuth";
import MobileUnsupported from "./MobileUnsupported";
import useWindowSize from "../../Components/CustomHooks/useWindowSize";






const BasePage = () => {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const Admin_registered = useSelector((state) => state.auth.roles.admin.registered);
  const AdminToken = useSelector((state) => state.auth.tokens.adminToken);
  const isOpenAuthModal = useSelector((state) => state.auth.isOpenAuthModal);
  const User_AreaPin = useSelector((state) => state.auth.roles.user.areaPin);
  const userTcoken = useSelector((state) => state.auth?.tokens?.userToken);
  const userId = useSelector((state) => state.auth?.roles?.user?.id);

  const [admin, setAdmin] = useState(false);
  const [pincode, setPincode] = useState(User_AreaPin);
  const [isValid, setIsValid] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isServiceAble, setIsServiceAble] = useState(false);

  useEffect(() => {
    if (userTcoken) {
      const loadBookings = async () => {
        const result = await getUserAllBookings(userId);
        if (result.success) {
          dispatch(setCart({ items: result.bookings }));
        }
      };
      loadBookings();
    }
  }, [userTcoken, dispatch, userId]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const base64Url = token.split(".")[1];
    const decodedPayload = JSON.parse(window.atob(base64Url));
    return decodedPayload.exp < Math.floor(Date.now() / 1000);
  };

  useEffect(() => {
    const pathMatch = location.pathname.match(/^\/(admin|superadmin|merchant|manager)\//);
    const isAdmin = pathMatch !== null;

    if (AdminToken && isTokenExpired(AdminToken)) {
      if (isAdmin) {
        toast.warn("Token expired or missing. Redirecting to login.");
        localStorage.removeItem("state");
        navigate("/admin/login");
      }
    }

    if (isAdmin && !Admin_registered) {
      navigate("/admin/login");
    }

    setAdmin(isAdmin);
  }, [location.pathname, width]);

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000);
  };

  const verifyPincode = async (pin) => {
    setLoading(true);
    try {
      const apiResponse = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await apiResponse.json();

      if (data[0].Status === "Success") {
        const response = await checkPincodeAvailability(pin);
        if (response?.active) {
          dispatch(updateAreaPin({ pincode: pin }));
          setIsValid(true);
          setIsServiceAble(true);
          setPincodeInfo(data.address);
        } else {
          toast.warn("Service not available in your area");
          setIsValid(false);
          triggerVibration();
        }
      } else {
        toast.warn("Wrong pincode");
        setIsValid(false);
        triggerVibration();
      }
    } catch (err) {
      toast.error("Error checking pincode");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data?.address?.postcode) {
            verifyPincode(data.address.postcode);
          } else {
            toast.warn("Unable to fetch your pincode.");
            setLoading(false);
          }
        } catch {
          toast.error("Error fetching location data.");
        }
      },
      () => {
        toast.error("Please allow location permission.");
        setLoading(false);
      }
    );
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    if (value.length === 6) verifyPincode(value);
    else {
      setIsValid(false);
      setPincodeInfo(null);
    }
  };

  return (
    <>
      <ToastContainer />
      {isOpenAuthModal && <UserLoginSingupModal />}

      <Routes>
        <Route path="/admin/login" element={<AdminSuperAdminAuth />} />
        {admin && <Route path="/:userType/:token/*" element={<UserTypeHandler />} />}
        {!admin && (
          <Route
            path="/*"
            element={
              width >= 1024 ? (
                User_AreaPin ? (
                  <DesktopRoutes />
                ) : (
                  <PincodeModal
                    pincode={pincode}
                    handleChange={handleChange}
                    handleCurrentLocation={handleCurrentLocation}
                    isVibrating={isVibrating}
                    loading={loading}
                  />
                )
              ) : (
                <MobileUnsupported />
              )
            }
          />
        )}
      </Routes>
    </>
  );
};

export default BasePage;
