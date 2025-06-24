import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { setCart } from "../ReduxStore/Slices/auth";
import { getUserAllBookings } from "../CRUD Operations/Get";
import UserLoginSingupModal from "../Components/Users/Hotels/Hotel/UserLoginSingupModal";
import BaseRouting from "./Routes/BaseRouting";
import useWindowSize from "../Components/CustomHooks/useWindowSize";

const AppContent = () => {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userToken = useSelector((state) => state.auth?.tokens?.userToken);
  const userId = useSelector((state) => state.auth?.roles?.user?.id);
  const adminToken = useSelector((state) => state.auth?.tokens?.adminToken);
  const adminRegistered = useSelector((state) => state.auth.roles.admin.registered);
  const isOpenAuthModal = useSelector((state) => state.auth.isOpenAuthModal);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(window.atob(base64));
    return decodedPayload.exp < Math.floor(Date.now() / 1000);
  };

  useEffect(() => {
    if (userToken && userId) {
      (async () => {
        const result = await getUserAllBookings(userId);
        if (result.success) {
          dispatch(setCart({ items: result.bookings }));
        }
      })();
    }
  }, [userToken, userId, dispatch]);

  useEffect(() => {
    const pathMatch = location.pathname.match(/^\/(admin|superadmin|merchant|manager)\//);
    const isAdminRoute = pathMatch !== null;

    if (adminToken && isTokenExpired(adminToken)) {
      if (isAdminRoute) {
        toast.warn("Token expired or missing. Redirecting to login.");
        localStorage.removeItem("state");
        navigate("admin/login");
      }
    }

    if (isAdminRoute && !adminRegistered) {
      navigate("admin/login");
    }
  }, [location.pathname, adminToken, adminRegistered, navigate]);

  return (
    <>
      <ToastContainer />
      {isOpenAuthModal && <UserLoginSingupModal />}
      <BaseRouting />
    </>
  );
};

export default AppContent;
