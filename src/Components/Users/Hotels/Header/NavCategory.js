import { useNavigate } from "react-router-dom";

const NavCategory = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Hotels", path: "/mytrip/" },
    { name: "Flight", path: "/mytrip/Flight" },
    { name: "Train", path: "/mytrip/Train" },
    { name: "Cab", path: "/mytrip/Cab" },
  ];

  return (
    <ul className="flex space-x-6 text-sm font-medium text-gray-700">
      {categories.map((cat, index) => (
        <li
          key={index}
          className="relative cursor-pointer hover:text-blue-700 transition duration-200"
          onClick={() => navigate(cat.path)}
        >
          <span className="px-2 py-1 hover:bg-blue-100 rounded-md transition-all duration-200">
            {cat.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default NavCategory;
