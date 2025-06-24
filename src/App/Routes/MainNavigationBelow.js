import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getUsersCategoy } from "../../CRUD Operations/Get";
import LoadingModal from "../../Components/LoadingModal";

const MainNavigationBelow = ({ activeTab }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getUsersCategoy();
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

  // Auto scroll every 5 seconds
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      container.scrollBy({
        left: 250, // pixels to scroll
        behavior: "smooth",
      });

      // Optional: reset to start when reaching end
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [categories]);

  if (loading) return <LoadingModal />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative top-[120px] rounded-3xl shadow-2xl backdrop-blur-md bg-gradient-to-br from-blue-300/10 via-blue-200/20 to-blue-100/30 border border-white/30">
      <h2 className="text-2xl sm:text-4xl md:text-2xl font-[cursive] text-center drop-shadow-lg mb-6">
        {activeTab === "Hotels"
          ? "Explore Hotel Categories"
          : `${activeTab} Coming Soon`}
      </h2>

      {activeTab === "Hotels" ? (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/mytrip/Category/${cat.id}/hotels/`}
              state={{ categoryId: cat.id }}
              className="hover:no-underline flex-shrink-0 w-60"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 overflow-hidden cursor-pointer">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10470/10470295.png"
            alt="Coming soon"
            className="w-24 h-24 mx-auto mb-4"
          />
          <p className="text-lg">
            Feature for <strong>{activeTab}</strong> will be available soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default MainNavigationBelow;
