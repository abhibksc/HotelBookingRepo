import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineBorderStyle,
  MdCardGiftcard,
} from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { BiLogInCircle } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IsOpenAuthModal, LogoutAll } from "../../../../ReduxStore/Slices/auth";

const NavLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userToken = useSelector((state) => state.auth.tokens.userToken);
  const { name, email, phone } = useSelector((state) => state.auth.roles.user);

  const isLoggedIn = userToken && (name || email || phone);

  const displayName = name || email || phone || "Login";

  const handleLoginClick = (e) => {
    e.preventDefault();
    dispatch(IsOpenAuthModal(true));
  };

  return (
    <li className="relative group text-sm font-medium text-gray-700 hidden xl:block">
      {/* Button */}
      <div
        className="flex items-center gap-1 cursor-pointer  p-5   hover:text-blue-600"
        onClick={() => {
          if (!isLoggedIn) handleLoginClick();
        }}
      >
        <span className="capitalize">{displayName}</span>
        <MdOutlineKeyboardArrowDown size={18} />
      </div>

      {/* Dropdown */}
      <div className="absolute left-0 w-56 bg-white shadow-lg rounded-md  p-2 hidden group-hover:block z-50">
        <ul className="space-y-3 text-gray-800 cursor-pointer">
          {!isLoggedIn && (
            <li
              className="flex items-center gap-2 hover:text-blue-600 transition"
              onClick={handleLoginClick}
            >
              <BiLogInCircle />
              <span>Login</span>
            </li>
          )}

          {isLoggedIn && (
            <>
              <li
                className="flex items-center gap-2 hover:text-blue-600 transition"
                // onClick={() => navigate(`/mytrip-user/profile/${userToken}`)}
                onClick={() => navigate(`/`)}
              >
                <FaRegUserCircle />
                <span>My Profile</span>
              </li>
              <li
                className="flex items-center gap-2 hover:text-blue-600 transition"
                // onClick={() => navigate(`/mytrip-user/bookings/${userToken}`)}
                onClick={() => navigate(`/`)}
              >
                <MdOutlineBorderStyle />
                <span>Bookings</span>
              </li>
              <li
                className="flex items-center gap-2 hover:text-blue-600 transition"
                onClick={() => {
                  dispatch(LogoutAll());
                  navigate("/");
                }}
              >
                <IoMdLogOut />
                <span>Logout</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </li>
  );
};

export default NavLogin;
