import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTags,
  FaThLarge,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const Sidebar = ({ onLinkClick }) => {
  const AdminToken = useSelector((state) => state.auth?.tokens?.adminToken);

  const userName = "Admin User";
  const adminLogo = "https://www.hospitalitynet.org/picture/153043767.jpg"; // Replace with actual logo URL

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const sidebarLinks = [
    {
      to: `/admin/${AdminToken}/dashboard`,
      label: "Dashboard",
      icon: <FaHome />,
    },
    {
      to: `/admin/${AdminToken}/UserManagement`,
      label: "User Management",
      icon: <FaHome />,
    },
    {
      to: `/admin/${AdminToken}/CategoryManagement`,
      label: "Category Management",
      icon: <FaBox />,
    },
    {
      to: `/admin/${AdminToken}/HotelManagement`,
      label: "Hotel Management",
      icon: <FaBox />,
    },
        {
      to: `/admin/${AdminToken}/pincodeManagement`,
      label: "Pincode Management",
      icon: <FaBox />,
    },
    { to: `/admin/${AdminToken}/bookingManagement`, label: "Booking Management", icon: <FaBox /> },
  ];

  const renderLinks = (links, depth = 0) => {
    return (
      <ul className={`pl-${depth * 4} mb-4`}>
        {links.map((link, index) => (
          <li key={index} className="mb-3">
            {link.subLinks ? (
              <>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="hover:text-gray-300 w-full text-left flex items-center justify-between py-2 px-4 rounded-md transition-colors duration-200 text-base"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    {link.icon}
                    <span className="ml-2 text-base font-medium">
                      {link.label}
                    </span>
                  </motion.div>
                  {openAccordion === index ? (
                    <FaChevronUp className="text-base" />
                  ) : (
                    <FaChevronDown className="text-base" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderLinks(link.subLinks, depth + 1)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to={link.to}
                className={`hover:text-gray-300 flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                  link.textClass || ""
                } ${link.textColour || ""} text-base`}
                onClick={onLinkClick} // Close sidebar on link click
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  {link.icon}{" "}
                  <span className="ml-2 text-base">{link.label}</span>
                </motion.div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className=" hide-scrollbar h-full p-4 flex flex-col overflow-y-auto bg-gradient-to-br from-teal-800 to-teal-600 text-white shadow-md">
      <div className="flex items-center mb-8 border-b border-teal-700 pb-4">
        <img
          src={adminLogo}
          alt="Admin Panel Logo"
          className="w-12 h-12 mr-3 rounded-full shadow-lg"
        />
        <span className="text-xl font-bold">{userName}</span>
      </div>
      <nav>{renderLinks(sidebarLinks)}</nav>
      <div className="mt-auto">
        <Link
          to="/logout"
          className="hover:text-red-600 flex items-center  bg-teal-700 p-2 rounded-md transition-colors duration-200 text-base"
          onClick={onLinkClick}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <FaSignOutAlt className="text-base" />{" "}
            <span className="ml-2 text-base">Logout</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
