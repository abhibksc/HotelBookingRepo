import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  BrowserRouter,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./index.css"; // Ensure this import is present
import AdminSuperAdminAuth from "./Components/AdminPanel/AdminSuperAdminAuth";
import { toast, ToastContainer } from "react-toastify";
import useWindowSize from "./Components/CustomHooks/useWindowSize";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { checkPincodeAvailability } from "./CRUD Operations/Post";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import { setCart, updateAreaPin } from "./ReduxStore/Slices/auth";
import NotFound from "./Errors/NotFound";
import Hotel from "./Components/Users/Hotels/Hotel/Hotel";
import Booking from "./Components/Users/Hotels/Bookings/Booking";
import Header from "./Components/Users/Hotels/Header/Header";
import UserLoginSingupModal from "./Components/Users/Hotels/Hotel/UserLoginSingupModal";
import User from "./Components/Users/User/User";
import { getUserAllBookings } from "./CRUD Operations/Get";
import { HelmetProvider } from "react-helmet-async";

const UserTypeHandler = () => {
  const { userType, token } = useParams();
  const adminToken = useSelector((state) => state?.auth?.tokens?.adminToken);

  useEffect(() => {
    document.title = "Hotel Administrator";
  }, []);

  if (userType === "admin" && token === adminToken) {
    return <AdminPanel />;
  }

  return <h1>Unauthorized or Invalid Token</h1>;
};

const AppContent = () => {
  const { width } = useWindowSize(); // Get the screen width
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const Admin_registered = useSelector(
    (state) => state.auth.roles.admin.registered
  );
  const userTcoken = useSelector((state) => state.auth?.tokens?.userToken);
  const id = useSelector((state) => state.auth?.roles?.user?.id);

  const User_AreaPin = useSelector((state) => state.auth.roles.user.areaPin);
  const AdminToken = useSelector((state) => state.auth?.tokens?.adminToken);

  const isOpenAuthModal = useSelector((state) => state.auth.isOpenAuthModal);

  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [isServiceAble, setIsServiceAble] = useState(false);
  const [pincode, setPincode] = useState(User_AreaPin);
  const [isValid, setIsValid] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000); // Stop vibration after 3 seconds
  };

  const verifyPincode = async (pincode) => {
    setLoading(true);
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const pincodeResponse = await checkPincodeAvailability(pincode);

        if (pincodeResponse && pincodeResponse?.active === true) {
          dispatch(updateAreaPin({ pincode: pincode }));
          setIsValid(true);
          setPincodeInfo(data.address);
          setLoading(false);
          setIsServiceAble(true);
        } else if (
          pincodeResponse &&
          pincodeResponse.data.message === "Not Available"
        ) {
          toast.warn("Service not available in your area");
          setIsValid(false);
          setLoading(false);
          triggerVibration();
        }
      } else {
        toast.warn("wrong pincode");
        triggerVibration();
        setIsValid(false);
        setPincodeInfo(null);
      }
    } catch (error) {
      setIsValid(false);
      setPincodeInfo(null);
    }

    setLoading(false);
  };

  const isTokenExpired = (AdminToken) => {
    if (!AdminToken) return true;

    const base64Url = AdminToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(window.atob(base64));

    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return decodedPayload.exp < currentTime;
  };

  useEffect(() => {
    if (userTcoken) {
      const fun = async () => {
        const result = await getUserAllBookings(id);

        if (result.success) {
          dispatch(
            setCart({
              items: result.bookings,
            })
          );
        }
      };
      fun();
    }
  }, []);

  useEffect(() => {
    // Check if the current path is related to admin/merchant/etc.
    const pathMatch = location.pathname.match(
      /^\/(admin|superadmin|merchant|manager)\//
    );

    const isAdmin = pathMatch !== null;

    if (AdminToken && isTokenExpired(AdminToken)) {
      if (isAdmin) {
        toast.warn("Token expired or missing. Redirecting to login.");

        localStorage.removeItem("state");
        navigate("admin/login");
      }
    }

    // If not an admin, proceed with profile validation and redirection logic
    if (!isAdmin) {
      // navigate("/");
    } else {
      if (!Admin_registered) {
        console.log("Admin not registered");
        navigate("admin/login");
      }

      setAdmin(true);
    }
  }, [width, location.pathname]);

  const handleChange = (event) => {
    const { value } = event.target;
    setPincode(value);
    if (value.length === 6) {
      verifyPincode(value);
    } else {
      setIsValid(null);
      setPincodeInfo(null);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Success callback
    const onSuccess = async (position) => {
      const { latitude, longitude } = position.coords;

      fetchAddressFromCoords(latitude, longitude);
    };

    // Error callback
    const onError = (error) => {
      const errorMessages = {
        1: "Permission denied. Please enable location services.",
        2: "Position unavailable. Unable to determine your location.",
        3: "Timeout. Location request took too long.",
        default: "An unknown error occurred while fetching location.",
      };

      const message = errorMessages[error.code] || errorMessages.default;
      alert(message);
    };

    // Geolocation options
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Timeout after 10 seconds
      maximumAge: 0, // No cached position
    };

    // Fetch the current location
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  };

  // Function to fetch address details from coordinates
  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Example: Check pincode availability
      if (data.address && data.address.postcode) {
        const pincodeResponse = await checkPincodeAvailability(
          data.address.postcode
        );

        if (pincodeResponse && pincodeResponse.data.message === "Available") {
          dispatch(updateAreaPin({ pincode: pincode }));
          setIsValid(true);
          setPincodeInfo(data.address);
          setLoading(false);
          setIsServiceAble(true);
        } else if (
          pincodeResponse &&
          pincodeResponse.data.message === "Not Available"
        ) {
          toast.warn("Service not available in your area");
          setIsValid(false);
          setLoading(false);
          triggerVibration();
        }
      } else {
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred while fetching location data.");
    }
  };

  return (
    <>
      <ToastContainer />

      {isOpenAuthModal && <UserLoginSingupModal />}

      <Routes>
        {/* user Auth */}

        <Route path="admin/login" element={<AdminSuperAdminAuth />} />

        {admin && (
          <Route path={`/:userType/:token/*`} element={<UserTypeHandler />} />
        )}

        {/* Main app routes */}
        {!admin && (
          <Route
            path="/*"
            element={
              <>
                {width >= 1024 ? (
                  User_AreaPin ? (
                    <div className="flex flex-col min-h-screen bg-white">
                      <div className="flex-grow">
                        <div className="md:hidden mx-auto w-72 mt-3 rounded-md border">
                          <input
                            type="text"
                            id="search"
                            placeholder="Search"
                            className="rounded-lg px-3 py-1"
                          />
                        </div>
                        <Header />
                        <Routes>
                          <Route path="/" element={<Hotel />} />
                          <Route path="/mytrip/*" element={<Hotel />} />
                          <Route path="/mytrip-user/*" element={<User />} />

                          <Route path="/bookings/*" element={<Booking />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        className="fixed z-40 inset-0 bg-opacity-40 bg-black flex justify-center items-center"
                        style={{
                          backgroundImage: `url('https://img.freepik.com/free-vector/blank-blue-leafy-poster_53876-118169.jpg?semt=ais_hybrid&w=740')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="">
                    





                    <div className="flex flex-col justify-center items-center gap-4">

                      <div className="text-4xl">
                        <span className="text-red-500 font-bold">My</span> Trip
                      </div>


                            <span className="font-bold ">
                            Please enter your pincode to check hotel
                            availability in your area.
                          </span>
                    </div>
                          <div
                            className={`absolute border-b shadow-lg shadow-black top-14 bg-white self-start flex flex-col justify-start rounded-md p-4 ${
                              isVibrating ? "vibrate" : ""
                            }`}
                            style={{
                              backgroundImage: `url('https://img.freepik.com/free-vector/blank-blue-leafy-poster_53876-118169.jpg?semt=ais_hybrid&w=740')`,
                              // backgroundSize: 'cover',
                              // backgroundPosition: 'center',
                            }}
                          >
                            <span className="font-inter font-semibold text-black">
                              Verify Location
                            </span>
                            <p className="text-gray-500 font-inter text-gray-800 text-[12px]">
                              Only available in selected cities
                            </p>

                            <div className="flex   self-start text-black py-2 mt-4 gap-5 mb-4">
                              <input
                                value={pincode || ""}
                                onChange={handleChange}
                                type="text"
                                className="border-r-2 self-start rounded-md p-2 focus:outline-none px-2"
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
                              <div className="flex items-center  ">
                                <div className="spinner-border animate-spin inline-block w-3 h-3 border-4 rounded-full border-blue-300 border-t-transparent font-thin"></div>
                                <span className="ml-2 text-black">
                                  Detecting location...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center animate-fade-in">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                              🚫 Mobile Not Supported
                            </h1>
                            <p className="text-gray-600 text-lg">
                              Please open this site on a{" "}
                              <span className="font-semibold">
                                desktop or laptop
                              </span>{" "}
                              for the best experience.
                            </p>
                          </div>
                        }
                      />
                    </Routes>
                  </div>
                )}
              </>
            }
          />
        )}
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-200">
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
};

export default App;
