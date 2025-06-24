import React, { useEffect, useState } from "react";
import NavLogin from "./NavLogin";
import NavCart from "./NavCart";
import NavCategory from "./NavCategory";
import { useNavigate } from "react-router-dom";

const Header = ({ page }) => {
  const navigate = useNavigate();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 80); // you can tune 80px threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Primary Header (visible at top) */}
      {!showSticky && (
        <header
          className={`      
        
        ${page === "MainPage" ? "text-white bg-white/30" : "text-gray-800 bg-white/50 "}
        
        fixed top-0 z-50 w-full h-16  backdrop-blur-lg shadow-sm border-b border-white/20 transition-all duration-300`}
        >
          <div className="container mx-auto px-4 xl:px-12 h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity duration-200">
              <div
                className={`text-2xl font-bold  ${page === "MainPage" ? "text-white" : "text-black" }`}
                onClick={() => navigate("/")}
              >
                Make
                <span className="text-red-500 font-[cursive] drop-shadow-md italic">
                  My
                </span>
                Plane
              </div>
            </div>

            {/* Right Section */}
            <ul className="hidden xl:flex items-center space-x-8">
              <NavLogin page={page} />
              <NavCart />
              <div
                className="cursor-pointer"
                onClick={() => window.open("/admin/login", "_blank")}
              >
                Admin
              </div>
            </ul>
          </div>
        </header>
      )}

      {/* Sticky Header (visible after scroll) */}
      {showSticky && (
        <header
          style={{
            backgroundImage: `url('https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/bg4.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className=
          {`
               ${page === "MainPage" ? "text-white bg-white/30" : "text-gray-800 bg-white/50 "}
            
            fixed top-0 z-50 w-full h-14   border-white/30 backdrop-blur-sm transition-all duration-300
            
            
            `}
        >
          <div className="container mx-auto px-4 xl:px-12 h-full flex items-center justify-between">
            <div
              className="text-lg font-bold text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              Make
              <span className="text-red-400 font-[cursive] drop-shadow-md italic">
                My
              </span>
              Plane
            </div>

            <ul className="flex items-center space-x-6">
              <NavLogin />
              <NavCart />
            </ul>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
