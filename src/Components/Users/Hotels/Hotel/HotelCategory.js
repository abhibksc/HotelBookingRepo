import React, { useEffect, useState } from "react";
import LoadingModal from "../../../LoadingModal";
import { Link } from "react-router-dom";
import { getUsersCategoy } from "../../../../CRUD Operations/Get";

const HotelCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getUsersCategoy();
        console.log(response);
        
        if (response.success) {
          setCategories(response.Category);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <LoadingModal />;

  return (
   <div className="pt-24 pb-16 px-4 max-w-screen-xl mx-auto text-white">
  <h2 className="text-3xl font-bold text-center mb-10 drop-shadow-lg">
    Explore Hotel Categories
  </h2>

  <div className="flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-400">
    {categories.length > 0 &&
      categories.map((cat) => (
        <Link
          to={`/mytrip/Category/${cat.id}/hotels/`}
          key={cat.id}
          state={{ categoryId: cat.id }}
          className="min-w-[240px] flex-shrink-0"
        >
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-44 object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-center text-white drop-shadow">
                {cat.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
  </div>
</div>

  );
};

export default HotelCategory;
