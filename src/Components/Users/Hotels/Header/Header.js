import NavLogin from "./NavLogin";
import NavCart from "./NavCart";
import NavCategory from "./NavCategory";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 xl:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer transform transition-transform hover:scale-105">
          <div className="flex items-center text-xl font-bold rotate-[-6deg] shadow-md shadow-red-400 rounded-md px-2 py-1">
            <span className="text-red-600 underline">My</span>
            <span className="text-gray-800 ml-1">trip</span>
          </div>
        </div>

        {/* Categories */}
        <div className="hidden xl:block">
          <NavCategory />
        </div>

        {/* Right Section */}
        <ul className="hidden xl:flex items-center space-x-8">
          <NavLogin />
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
  );
};

export default Header;
